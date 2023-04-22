import { UserAccount } from "../models/userAccount";
import { UserCollection } from "../schemas/profileSchema";

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
        return await this.repository.findOne({email : email}) as UserAccount;
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
