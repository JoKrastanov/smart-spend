import { AccountType } from "../../types/accountTypes";
import jwt from "jsonwebtoken";

export const signJWTToken = (userId: string, accountType: AccountType) => {
    const payload = { id: userId, user_type: accountType };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
}