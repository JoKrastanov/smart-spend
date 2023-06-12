import config from "../../config";
import { JWTAuthentication } from "authentication-validation/lib";

import { generateUUID } from "../helpers/generateUUID";
import { Company } from "../models/company";
import { Country } from "../types/countries";
import { CompanyRepository } from "../repositories/companyRepository";
import { RabbitMQService } from "./RabbitMQService";
import { LicenseService } from "./licenseService";
import { LicenseRepository } from "../repositories/licenseRepository";

export class CompanyService {
  private jwtAuth;
  private licenseRepository: LicenseRepository;
  private comapnyRepository: CompanyRepository;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.jwtAuth = JWTAuthentication();
    this.comapnyRepository = new CompanyRepository();
    this.licenseRepository = new LicenseRepository();
    if (config.server.environment === "test") return;
    this.rabbitMQService = new RabbitMQService();
    this.init().catch((err) =>
      console.log("Error connecting to message broker", err)
    );
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("delete-company");
    } catch (error) {
      console.log(error);
    }
  };

  verifyBearerToken = async (
    authorization: string,
    refresh: string
  ): Promise<boolean> => {
    if (config.server.environment === "development") {
      return true;
    }
    if (!authorization || !refresh || authorization === "null") {
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
      console.log(error);
      throw error;
    }
  };

  getCompanies = async () => {
    try {
      return await this.comapnyRepository.getAll();
    } catch (error) {
      return null;
    }
  };

  getCompany = async (id: string) => {
    try {
      return await this.comapnyRepository.getById(id);
    } catch (error) {
      return null;
    }
  };

  deleteCompany = async (id: string) => {
    try {
      const companyToDelete = await this.comapnyRepository.getById(id);
      if (!companyToDelete) {
        return false;
      }
      await this.licenseRepository.delete(id);
      await this.rabbitMQService.sendMessage("delete-accounts", {
        companyId: id,
      });
      await this.rabbitMQService.sendMessage("delete-bankaccounts", {
        companyId: id,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}
