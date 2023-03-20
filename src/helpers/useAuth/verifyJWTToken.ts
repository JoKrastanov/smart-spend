import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AccountType } from "../../types/accountTypes";
dotenv.config();

export const verifyJWTToken = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET);
}

export const userIsAdmin = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET).user_type === AccountType.Admin;
}

export const userIsManager = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET).user_type === AccountType.Manager;
}

export const userIsUser = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET).user_type === AccountType.User;
}