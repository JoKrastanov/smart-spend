import { getCurrentUtcTime } from "../helpers/getCurrentUTCTime";
import { License } from "../models/license";
import { Money } from "../models/money";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";
import { CurrencyCode } from "../types/currencies";
import { LicenseTypes } from "../types/licenseTypes";
import { CompanyService } from "./companyService";
import { RabbitMQService } from "./RabbitMQService";

export class LicenseService {
  private companyService: CompanyService;
  private licenses: License[];
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.licenses = [];
    this.companyService = new CompanyService();
    this.rabbitMQService = new RabbitMQService();
    this.companyService.registerCompany(
      "Company",
      Country.Bulgaria,
      "Botevgradsko shose 7",
      "123"
    );
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
    const company = this.companyService.getCompany(companyId);
    if (!company) return null;
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

  registerBankAccount = async (
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: number,
    currency: CurrencyCode
  ): Promise<String> => {
    try {
      const license = this.getLicenseByCompany(companyId);
      if (!license || !license.canAddBankAccount()) {
        return null;
      }
      await this.rabbitMQService.sendMessage("bank-accounts", {
        companyId,
        name,
        department,
        IBAN,
        balance,
        currency
      });
      let response;
      await this.rabbitMQService.consumeMessages(
        "bank-accounts-response",
        async (message) => {
          if (message.message !== "created") {
            response = null;
          }
          response = message.message;
        }
      );
      license.registerBankAccount();
      return response;
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
      license.registerEmployee()
    } catch (error) {
      return console.log(error);
    }
  };
}
