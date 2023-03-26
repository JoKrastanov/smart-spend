import { generateLicenseID } from "../helpers/generateLicenseID";
import { getCurrentUtcTime } from "../helpers/getCurrentUTCTime";
import { License } from "../models/license";
import { LicenseTypes } from "../types/licenseTypes";
import { CompanyService } from "./companyService";

export class LicenseService {
  private companyService: CompanyService;
  private licenses: License[];

  constructor() {
    this.companyService = new CompanyService();
    this.licenses = [];
  }

  getAllLicenses = () => {
    return this.licenses;
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
      const license = new License(
        generateLicenseID(),
        getCurrentUtcTime(),
        licenseType
      );
      this.licenses.push(license);
      return license;
    }
    if (!requestedEmployeeNumber || !requestedBankAccountNumber) return;
    const license = new License(
      generateLicenseID(),
      getCurrentUtcTime(),
      licenseType,
      requestedEmployeeNumber
    );
    this.licenses.push(license);
    return license;
  };
}
