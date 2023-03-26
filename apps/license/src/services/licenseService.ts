import { CompanyHasLicenseError } from "../errors/CompanyHasLicenseError";
import { getCurrentUtcTime } from "../helpers/getCurrentUTCTime";
import { License } from "../models/license";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";
import { LicenseTypes } from "../types/licenseTypes";
import { RabbitMQService } from "./RabbitMQService";

export class LicenseService {
  private licenses: License[];
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.licenses = [];
    this.rabbitMQService = new RabbitMQService();
    this.init();
  }

  private init = async () => {
    await this.rabbitMQService.connect();
    await this.rabbitMQService.createQueue("users");
  };

  getAllLicenses = () => {
    return this.licenses;
  };

  getLicenseByCompany = (companyId: string) => {
    return this.licenses.find((license) => license.companyId === companyId);
  };

  issueLicense = (
    companyId: string,
    licenseType: LicenseTypes,
    requestedEmployeeNumber?: number,
    requestedBankAccountNumber?: number
  ) => {
    const companyLicense = this.getLicenseByCompany(companyId);
    if (companyLicense) throw new CompanyHasLicenseError("error");
    if (
      licenseType === LicenseTypes.Basic ||
      licenseType === LicenseTypes.Pro
    ) {
      const license = new License(companyId, getCurrentUtcTime(), licenseType);
      this.licenses.push(license);
      return license;
    }
    if (!requestedEmployeeNumber || !requestedBankAccountNumber) return;
    const license = new License(
      companyId,
      getCurrentUtcTime(),
      licenseType,
      requestedEmployeeNumber
    );
    this.licenses.push(license);
    return license;
  };

  activateLicense = (companyId) => {
    const license = this.getLicenseByCompany(companyId);
    license.activateLicense();
    return license;
  };

  registerBankAccount = (companyId: string) => {
    const license = this.getLicenseByCompany(companyId);
    if (!license || !license.canAddBankAccount()) {
      return null;
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
      const license = this.getLicenseByCompany(companyId);
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
    } catch (error) {
      return console.log(error);
    }
  };
}
