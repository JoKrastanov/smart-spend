import { generateLicenseID } from "../helpers/generateLicenseID";
import { getCurrentUtcTime } from "../helpers/getCurrentUTCTime";
import { License } from "../models/license";
import { Money } from "../models/money";
import { CurrencyCode } from "../types/currencies";
import { LicenseTypes } from "../types/licenseTypes";
import { CompanyService } from "./companyService";

export class LicenseService {
  companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

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
      return new License(
        generateLicenseID(),
        getCurrentUtcTime(),
        LicenseTypes.Basic
      );
    }
    if (!requestedEmployeeNumber || !requestedBankAccountNumber) return;
    return new License(
      generateLicenseID(),
      getCurrentUtcTime(),
      LicenseTypes.Enterprise,
      requestedEmployeeNumber
    );
  };
}
