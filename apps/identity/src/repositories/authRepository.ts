import { UserAccount } from "../models/userAccount";
import { UserCollection } from "../schemas/profileSchema";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";

export class AuthRepository {
  private repository = UserCollection;

  constructor() {}

  getAll = async () => {
    try {
      return await this.repository.find() as UserAccount[];
    } catch (error) {
      throw error;
    }
  };

  getByEmail = async (email: String) => {
    try {
        const fetchedUser = await this.repository.findOne({email : email});
        return new UserAccount(
          fetchedUser.id,
          fetchedUser.firstName,
          fetchedUser.lastName,
          fetchedUser.address,
          fetchedUser.phoneNumber,
          Country[fetchedUser.country],
          fetchedUser.companyId,
          fetchedUser.email,
          fetchedUser.password,
          fetchedUser.salt,
          fetchedUser.department,
          AccountType[fetchedUser.accountType])
      } catch (error) {
        throw error;
      }
  }

  add = async (user: UserAccount) => {
    try {
      const newUser = new this.repository({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        country: user.country,
        companyId: user.companyId,
        email: user.email,
        password: user.password,
        salt: user.passwordSalt,
        department: user.department,
        accountType: user.accountType,
      });
      newUser.save();
      return user;
    } catch (error) {
      throw error;
    }
  };
}
