import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import { UserAccount } from "../models/userAccount";
import { AccountType } from "../types/accountTypes";
import { IPasswordHash } from "../types/passwordHash";
import { Country } from "../types/countries";
import { RabbitMQService } from "./RabbitMQService";
import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";

dotenv.config();

export class AuthService {
  private users: UserAccount[];
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.users = [];
    this.rabbitMQService = new RabbitMQService();
    this.init();
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("users");
      this.rabbitMQService.consumeMessages("users", async (message) => {
        const user = this.addUser(
          message.firstName,
          message.lastName,
          message.address,
          message.phoneNumber,
          message.country,
          message.companyId,
          message.email,
          message.password,
          message.department,
          message.accountType
        );
        this.rabbitMQService.sendMessage("users", user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  getUsers = (): UserAccount[] => {
    return this.users;
  };

  addUser = async (
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    country: Country,
    companyId: string,
    email: string,
    password: string,
    department: string,
    accountType: AccountType
  ): Promise<UserAccount> => {
    try {
      const encryptedPassword = await this.encryptPassword(password);
      if (encryptedPassword instanceof Error) {
        throw encryptedPassword;
      }
      const newUser = new UserAccount(
        generateUUID(),
        firstName,
        lastName,
        address,
        phoneNumber,
        country,
        companyId,
        email,
        encryptedPassword.hash,
        encryptedPassword.salt,
        department,
        accountType
      );
      this.users.push(newUser);
      return newUser;
    } catch (error) {
      return null;
    }
  };

  loginCheck = async (inputPassword: string, userPassword: string) => {
    try {
      return await bcrypt.compare(inputPassword, userPassword);
    } catch (error) {
      return new Error(error);
    }
  };

  encryptPassword = async (
    inputPassword: string
  ): Promise<IPasswordHash | Error> => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(inputPassword, salt);
      return {
        hash,
        salt,
      };
    } catch (error) {
      return new Error(error);
    }
  };

  verifyJWTToken = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET);
  };

  signJWTToken = (userId: string, accountType: AccountType) => {
    const payload = { id: userId, user_type: accountType };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  signJWTRefreshToken = (userId: string, accountType: AccountType) => {
    const payload = { id: userId, user_type: accountType };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  };

  userIsAdmin = async (token: string) => {
    return (
      (await jwt.verify(token, process.env.JWT_SECRET).user_type) ===
      AccountType.Admin
    );
  };

  userIsManager = async (token: string) => {
    return (
      (await jwt.verify(token, process.env.JWT_SECRET).user_type) ===
      AccountType.Manager
    );
  };

  userIsUser = async (token: string) => {
    return (
      (await jwt.verify(token, process.env.JWT_SECRET).user_type) ===
      AccountType.User
    );
  };
}
