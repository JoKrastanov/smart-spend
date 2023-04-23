import bcrypt from "bcrypt";
import config from "../../config";
import { JWTAuthentication } from "authentication-validation/lib";

import { UserAccount } from "../models/userAccount";
import { AccountType } from "../types/accountTypes";
import { IPasswordHash } from "../types/passwordHash";
import { Country } from "../types/countries";
import { RabbitMQService } from "./RabbitMQService";
import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { AuthRepository } from "../repositories/authRepository";

export class AuthService {
  private jwtAuth;
  private authRepository: AuthRepository;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.jwtAuth = JWTAuthentication();
    this.authRepository = new AuthRepository();
    if (config.server.environment !== "test" && config.server.environment !== "development") {
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
    if (config.server.environment === "development") {
      return true;
    }
    if (!authorization || !refresh || authorization === "null" ) {
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

  getUsers = async (): Promise<UserAccount[]> => {
    try {
      return await this.authRepository.getAll();
    } catch (error) {
      return [];
    }
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
      const userExists = await this.authRepository.getByEmail(email);
      if (userExists) {
        throw new Error("This email is already in use");
      }
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
      this.authRepository.add(newUser);
      return this.signAuthAndRefreshToken(newUser);
    } catch (error) {
      throw error;
    }
  };

  loginCheck = async (
    email: string,
    inputPassword: string
  ): Promise<{ token: string; refreshToken: string }> => {
    try {
      const user = await this.authRepository.getByEmail(email);
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
