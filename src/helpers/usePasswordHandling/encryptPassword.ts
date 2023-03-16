import bcrypt from "bcrypt";
import { IPasswordHash } from "../../types/passwordHash";

export const encryptPassword = async (inputPassword: string): Promise<IPasswordHash | Error> => {
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
