import { Company } from "../models/company";
import { CompanyCollection } from "../schemas/companySchema";
import { Country } from "../types/countries";

export class CompanyRepository {
  private repository = CompanyCollection;

  constructor() {
    console.log("Initializing company repository");
  }

  getAll = async (): Promise<Company[]> => {
    try {
      return (await this.repository.find()) as Company[];
    } catch (error) {
      throw error;
    }
  };

  getById = async (id: string): Promise<Company> => {
    try {
      const fetchedCompany = (await this.repository.findOne({
        id: id,
      })) as Company;
      return new Company(
        fetchedCompany.id,
        fetchedCompany.name,
        Country[fetchedCompany.country],
        fetchedCompany.address
      );
    } catch (error) {
      throw error;
    }
  };

  add = async (company: Company): Promise<Company> => {
    try {
      const newCompany = new this.repository({
        id: company.id,
        name: company.name,
        country: company.country,
        address: company.address,
      });
      await newCompany.save();
      return company;
    } catch (error) {
      throw error;
    }
  };
}
