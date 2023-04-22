import { Company } from "../models/company";
import { CompanyCollection } from "../schemas/companySchema";

export class AuthRepository {
  private repository = CompanyCollection;

  constructor() {}

  getAll = async () => {
    try {
      return await this.repository.find() as Company[];
    } catch (error) {
      throw error;
    }
  };

  getByEmail = async (email: String) => {
    try {
        return await this.repository.findOne({email : email}) as Company;
      } catch (error) {
        throw error;
      }
  }

  add = async (user: Company) => {
    try {
      
      return user;
    } catch (error) {
      throw error;
    }
  };
}
