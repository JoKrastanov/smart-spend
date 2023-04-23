import dotenv from "dotenv";
import config from "../../config";
import { JWTAuthentication } from "authentication-validation/lib";

import { generateUUID } from "../helpers/generateUUID";
import { Company } from "../models/company";
import { Country } from "../types/countries";
import { CompanyRepository } from "../repositories/companyRepository";

dotenv.config();

export class CompanyService {
  private jwtAuth;
  private comapnyRepository: CompanyRepository;

  constructor() {
    this.jwtAuth = JWTAuthentication();
    this.comapnyRepository = new CompanyRepository();
  }

  verifyBearerToken = async (
    authorization: string | string[],
    refresh: string | string[]
  ): Promise<boolean> => {
    if (config.server.environment === "development") {
      return true;
    }
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

  registerCompany = async (
    name: string,
    country: Country,
    address: string,
    id?: string
  ): Promise<Company | null> => {
    try {
      let newCompany = new Company(
        id ? id : generateUUID(),
        name,
        country,
        address
      );
      newCompany = await this.comapnyRepository.add(newCompany);
      return newCompany;
    } catch (error) {
      throw error;
    }
  };

  getCompanies = async () => {
    return await this.comapnyRepository.getAll();
  };

  getCompany = async (id: string) => {
    return await this.comapnyRepository.getById(id);
  };
}
