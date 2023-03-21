import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import { UserAccount } from "../../../../shared/models/userAccount";
import { AccountType } from "../../../../shared/types/accountTypes";
import { IPasswordHash } from "../../../../shared/types/passwordHash";

dotenv.config();

export class AuthService {
    private users: UserAccount[];
    constructor() {
        this.users = [];
    }

    getUsers = (): UserAccount[] => {
        return this.users;
    }

    verifyJWTToken = async (token: string) => {
        return await jwt.verify(token, process.env.JWT_SECRET);
    }
    
    userIsAdmin = async (token: string) => {
        return await jwt.verify(token, process.env.JWT_SECRET).user_type === AccountType.Admin;
    }
    
    userIsManager = async (token: string) => {
        return await jwt.verify(token, process.env.JWT_SECRET).user_type === AccountType.Manager;
    }
    
    userIsUser = async (token: string) => {
        return await jwt.verify(token, process.env.JWT_SECRET).user_type === AccountType.User;
    }

    signJWTToken = (userId: string, accountType: AccountType) => {
        const payload = { id: userId, user_type: accountType };
        return jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        
    }

    loginCheck = async (inputPassword: string, userPassword: string) => {
      try {
        return await bcrypt.compare(inputPassword, userPassword);
      } catch (error) {
        return new Error(error);
      }
    };

    encryptPassword = async (inputPassword: string): Promise<IPasswordHash | Error> => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(inputPassword, salt);
          return {
            hash,
            salt
          };
        } catch (error) {
          return new Error(error);
        }
      };
}