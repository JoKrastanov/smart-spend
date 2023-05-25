import config from "../../config";
import { JWTAuthentication } from "authentication-validation/lib";

import { getCurrentUtcTime } from "../helpers/getCurrentUTCTime";
import { License } from "../models/license";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";
import { CurrencyCode } from "../types/currencies";
import { LicenseTypes } from "../types/licenseTypes";
import { CompanyService } from "./companyService";
import { RabbitMQService } from "./RabbitMQService";
import { LicenseRepository } from "../repositories/licenseRepository";
import { generateLicenseID } from "../helpers/generateLicenseID";

export class LicenseService {
  private licenseRepository: LicenseRepository;
  private companyService: CompanyService;
  private jwtAuth;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.jwtAuth = JWTAuthentication();
    this.licenseRepository = new LicenseRepository();
    this.companyService = new CompanyService();
    if (config.server.environment === "test") return;
    this.rabbitMQService = new RabbitMQService();
    this.init();
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("users");
      await this.rabbitMQService.createQueue("bank-accounts");
    } catch (error) {
      console.log(error);
    }
  };

  verifyBearerToken = async (
    authorization: string | string[],
    refresh: string | string[]
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

  getAllLicenses = async (): Promise<License[]> => {
    return await this.licenseRepository.getAll();
  };

  getLicenseByCompany = async (companyId: string): Promise<License> => {
    try {
      return await this.licenseRepository.getById(companyId);
    } catch (error) {
      throw error;
    }
  };

  issueLicense = async (
    companyId: string,
    licenseType: LicenseTypes,
    requestedEmployeeNumber?: number,
    requestedBankAccountNumber?: number
  ): Promise<License> => {
    try {
      const company = await this.companyService.getCompany(companyId);
      const existingLicense = await this.licenseRepository.getById(companyId);
      if (!company || existingLicense) {
        return null;
      }
      if (
        licenseType === LicenseTypes.Basic ||
        licenseType === LicenseTypes.Pro
      ) {
        let license = new License(
          generateLicenseID(),
          companyId,
          getCurrentUtcTime(),
          licenseType,
          true
        );
        license = await this.licenseRepository.add(license);
        return license;
      }
      if (!requestedEmployeeNumber || !requestedBankAccountNumber) {
        return;
      }
      let license = new License(
        generateLicenseID(),
        companyId,
        getCurrentUtcTime(),
        licenseType,
        true,
        requestedEmployeeNumber,
        requestedBankAccountNumber
      );
      license = await this.licenseRepository.add(license);
      return license;
    } catch (error) {
      throw error;
    }
  };

  activateLicense = async (companyId): Promise<License> => {
    try {
      let license = await this.getLicenseByCompany(companyId);
      if (!license) {
        return null;
      }
      license.activateLicense();
      license = await this.licenseRepository.update(license);
      return license;
    } catch (error) {
      throw error;
    }
  };

  registerBankAccount = async (
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: number,
    currency: CurrencyCode
  ): Promise<Boolean> => {
    try {
      const license = await this.getLicenseByCompany(companyId);
      if (!license || !license.canAddBankAccount()) {
        return null;
      }
      await this.rabbitMQService.sendMessage("bank-accounts", {
        companyId,
        name,
        department,
        IBAN,
        balance,
        currency,
      });
      license.registerBankAccount();
      await this.licenseRepository.update(license);
      return true;
    } catch (error) {
      throw error;
    }
  };

  registerEmployee = async (
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    country: Country,
    companyId: string,
    email: string,
    password: string,
    department: string,
    accountType: AccountType
  ) => {
    try {
      const license = await this.getLicenseByCompany(companyId);
      if (!license || !license.canRegisterEmployee()) {
        return null;
      }
      await this.rabbitMQService.sendMessage("users", {
        firstName,
        lastName,
        address,
        phoneNumber,
        country,
        companyId,
        email,
        password,
        department,
        accountType,
      });
      license.registerEmployee();
      await this.licenseRepository.update(license);
    } catch (error) {
      return console.log(error);
    }
  };
}
