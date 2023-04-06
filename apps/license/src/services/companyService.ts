import dotenv from "dotenv";
import { JWTAuthentication } from "authentication-validation/lib";

import { generateUUID } from "../helpers/generateUUID";
import { Company } from "../models/company";
import { Country } from "../types/countries";

dotenv.config();

export class CompanyService {
  private companies: Company[];
  private jwtAuth;

  constructor() {
    this.companies = [];
    this.jwtAuth = JWTAuthentication();
    this.registerCompany("Test Company", Country.Bulgaria, "Address", "123");
  }

  verifyBearerToken = async (
    authorization: string | string[],
    refresh: string | string[]
  ): Promise<boolean> => {
    if (!authorization || !refresh) {
      return false;
    }
    if (authorization === "null" || !authorization) {
      return false;
    }
    if (!(await this.jwtAuth.verifyJWTToken(authorization))) {
      if (!(await this.jwtAuth.verifyRefreshToken(refresh))) {
        return false;
      }
    }
    return true;
  };

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
