import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { JWTAuthentication } from "authentication-validation/lib";

import { UserAccount } from "../models/userAccount";
import { AccountType } from "../types/accountTypes";
import { IPasswordHash } from "../types/passwordHash";
import { Country } from "../types/countries";
import { RabbitMQService } from "./RabbitMQService";
import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";

dotenv.config();

export class AuthService {
  private users: UserAccount[];
  private jwtAuth;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.users = [];
    this.jwtAuth = JWTAuthentication();
    if (process.env.NODE_ENV !== "test") {
      this.rabbitMQService = new RabbitMQService();
      this.init();
    }
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("users");
      this.rabbitMQService.consumeMessages("users", async (message) => {
        const user = await this.addUser(
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
        this.rabbitMQService.sendMessage("users", user.user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  signAuthAndRefreshToken = (
    user: UserAccount
  ): { token: string; refreshToken: string; user: UserAccount } => {
    return {
      token: this.jwtAuth.signJWTToken(user.id, user.accountType),
      refreshToken: this.jwtAuth.signJWTRefreshToken(user.id, user.accountType),
      user: user,
    };
  };

  verifyBearerToken = async (
    authorization: string | string[],
    refresh: string | string[]
  ): Promise<boolean> => {
    if (!authorization || !refresh) {
      return false;
    }
    if (authorization === "null" || !authorization) {
      return false;
    }
    if (!(await this.jwtAuth.verifyJWTToken(authorization))) {
      if (!(await this.jwtAuth.verifyRefreshToken(refresh))) {
        return false;
      }
    }
    return true;
  };

  encryptPassword = async (inputPassword: string): Promise<IPasswordHash> => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(inputPassword, salt);
      return {
        hash,
        salt,
      };
    } catch (error) {
      throw new Error(error);
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
  ): Promise<{ token: string; refreshToken: string; user: UserAccount }> => {
    try {
      const encryptedPassword = await this.encryptPassword(password);
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
      return this.signAuthAndRefreshToken(newUser);
    } catch (error) {
      return null;
    }
  };

  loginCheck = async (
    email: string,
    inputPassword: string
  ): Promise<{ token: string; refreshToken: string }> => {
    try {
      const user = this.users.find((user) => user.email === email);
      if (!user) return null;
      const passwordCompare = await bcrypt.compare(
        inputPassword,
        user.password
      );
      if (!passwordCompare) return null;
      return this.signAuthAndRefreshToken(user);
    } catch (error) {
      throw new Error(error);
    }
  };
}
