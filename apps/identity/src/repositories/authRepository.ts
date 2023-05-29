import { UserAccount } from "../models/userAccount";
import { UserAccountDTO } from "../models/userAccountDTO";
import { UserCollection } from "../schemas/profileSchema";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";

export class AuthRepository {
  private repository = UserCollection;

  constructor() {}

  getAll = async (): Promise<UserAccount[]> => {
    try {
      return (await this.repository.find()) as UserAccount[];
    } catch (error) {
      throw error;
    }
  };

  getById = async (id: string): Promise<UserAccountDTO> => {
    try {
      const user = await this.repository.findOne({ id: id });
      return user
        ? new UserAccountDTO(
            user.firstName,
            user.lastName,
            user.address,
            Country[user.country],
            user.phone,
            user.email,
            user.companyId,
            user.department,
            AccountType[user.accountType]
          )
        : null;
    } catch (error) {
      throw error;
    }
  };

  getByEmail = async (email: String): Promise<UserAccount> => {
    try {
      const fetchedUser = await this.repository.findOne({ email: email });
      if (!fetchedUser) {
        return null;
      }
      return new UserAccount(
        fetchedUser.id,
        fetchedUser.firstName,
        fetchedUser.lastName,
        fetchedUser.address,
        fetchedUser.phone,
        Country[fetchedUser.country],
        fetchedUser.companyId,
        fetchedUser.email,
        fetchedUser.password,
        fetchedUser.salt,
        fetchedUser.department,
        AccountType[fetchedUser.accountType]
      );
    } catch (error) {
      throw error;
    }
  };

  add = async (user: UserAccount): Promise<UserAccount> => {
    try {
      const newUser = new this.repository({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone,
        country: user.country,
        companyId: user.companyId,
        email: user.email,
        password: user.password,
        salt: user.passwordSalt,
        department: user.department,
        accountType: user.accountType,
      });
      await newUser.save();
      if (!newUser) {
        return null;
      }
      return user;
    } catch (error) {
      throw error;
    }
  };
}
