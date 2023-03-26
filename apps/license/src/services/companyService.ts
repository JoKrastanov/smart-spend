import { generateUUID } from "../helpers/generateUUID";
import { Company } from "../models/company";
import { Country } from "../types/countries";

export class CompanyService {
  private companies: Company[];

  constructor() {
    this.companies = [];
    this.registerCompany("Test Company", Country.Bulgaria, "Address", "123");
  }

  registerCompany = (
    name: string,
    country: Country,
    address: string,
    id?: string
  ): Company | null => {
    const newCompany = new Company(
      id ? id : generateUUID(),
      name,
      country,
      address
    );
    this.companies.push(newCompany);
    return newCompany;
  };

  getCompanies = () => {
    return this.companies;
  };

  getCompany = (id: string) => {
    return this.companies.find((company) => company.id === id);
  };
}
