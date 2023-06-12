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
import { UserAuthResponse } from "../types/userAuthResponse";
import { UserAccountDTO } from "../models/userAccountDTO";

export class AuthService {
  private jwtAuth;
  private authRepository: AuthRepository;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.jwtAuth = JWTAuthentication();
    this.authRepository = new AuthRepository();
    if (
      config.server.environment === "test" ||
      config.server.environment === "development"
    )
      return;
    this.rabbitMQService = new RabbitMQService();
    this.init().catch((err) =>
      console.log("Error connecting to message broker", err)
    );
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("users");
      await this.rabbitMQService.createQueue("delete-accounts");
      await this.rabbitMQService.consumeMessages(
        "delete-accounts",
        async (message) => {
          await this.deleteAccounts(message.companyId);
        }
      );
      await this.rabbitMQService.consumeMessages("users", async (message) => {
        console.log(message);
        await this.addUser(
          message.firstName,
          message.lastName,
          message.address,
          message.phone,
          message.country,
          message.companyId,
          message.email,
          message.password,
          message.department,
          message.accountType
        );
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
    authorization: string,
    refresh: string
  ): Promise<boolean> => {
    if (config.server.environment === "development") {
      return true;
    }
    if (!authorization || !refresh || authorization === "null") {
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

  getUser = async (id: string): Promise<UserAccountDTO> => {
    try {
      const user = await this.authRepository.getById(id);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  addUser = async (
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    country: Country,
    companyId: string,
    email: string,
    password: string,
    department: string,
    accountType: AccountType
  ): Promise<UserAuthResponse> => {
    try {
      const userExists = await this.authRepository.getByEmail(email);
      if (userExists) {
        throw new Error("This email is already in use");
      }
      const encryptedPassword = await this.encryptPassword(password);
      const newUserId = await generateUUID();
      const newUser = new UserAccount(
        newUserId,
        firstName,
        lastName,
        address,
        phone,
        country,
        companyId,
        email,
        encryptedPassword.hash,
        encryptedPassword.salt,
        department,
        accountType
      );
      const userResp = await this.authRepository.add(newUser);
      if (!userResp) {
        return null;
      }
      return this.signAuthAndRefreshToken(newUser);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  loginCheck = async (
    email: string,
    inputPassword: string
  ): Promise<UserAuthResponse> => {
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

  deleteAccounts = async (companyId: string) => {
    try {
      await this.authRepository.deleteCompanyAccounts(companyId);
    } catch (error) {
      console.log(error);
    }
  };
}
