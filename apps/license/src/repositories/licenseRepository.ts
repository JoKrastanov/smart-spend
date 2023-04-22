import { License } from "../models/license";
import { LicenseCollection } from "../schemas/licenseSchema";

export class LicenseRepository {
  private repository = LicenseCollection;

  constructor() {}

  getAll = async () => {
    try {
      return (await this.repository.find()) as License[];
    } catch (error) {
      throw error;
    }
  };

  getById = async (id: String) => {
    try {
      return (await this.repository.findOne({ companyId: id })) as License;
    } catch (error) {
      throw error;
    }
  };

  add = async (license: License) => {
    try {
      const newLicense = new this.repository({
        id: license.id,
        companyId: license.companyId,
        basePrice: license.basePrice,
        datePurchased: license.datePurchased,
        lastPayment: license.lastPayment,
        maxEmployeeNumber: license.maxEmployeeNumber,
        registeredEmployees: license.registeredEmployees,
        pricePerEmployee: license.pricePerEmployee,
        maxBankAccountsNumber: license.maxBankAccountsNumber,
        registeredBankAccounts: license.registeredBankAccounts,
        licenseType: license.licenseType,
        active: license.active,
      });
      newLicense.save();
      return license;
    } catch (error) {
      throw error;
    }
  };
}
