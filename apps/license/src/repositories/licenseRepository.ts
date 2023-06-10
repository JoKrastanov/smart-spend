import { License } from "../models/license";
import { Money } from "../models/money";
import { LicenseCollection } from "../schemas/licenseSchema";
import { CurrencyCode } from "../types/currencies";
import { LicenseTypes } from "../types/licenseTypes";

export class LicenseRepository {
  private repository = LicenseCollection;

  constructor() {}

  getAll = async (): Promise<License[]> => {
    try {
      return (await this.repository.find()) as License[];
    } catch (error) {
      throw error;
    }
  };

  getById = async (id: String): Promise<License> => {
    try {
      const fetchedLicense = await this.repository.findOne({ companyId: id });
      if (!fetchedLicense) {
        return null;
      }
      return new License(
        fetchedLicense.id,
        fetchedLicense.companyId,
        fetchedLicense.datePurchased,
        LicenseTypes[fetchedLicense.licenseType],
        false,
        0,
        0,
        fetchedLicense.lastPayment,
        fetchedLicense.maxEmployeeNumber,
        fetchedLicense.registeredEmployees,
        new Money(
          fetchedLicense.pricePerEmployee.amount,
          CurrencyCode[fetchedLicense.pricePerEmployee.currency],
          false
        ),
        fetchedLicense.maxBankAccountsNumber,
        fetchedLicense.registeredBankAccounts,
        fetchedLicense.active
      );
    } catch (error) {
      throw error;
    }
  };

  add = async (license: License): Promise<License> => {
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
      await newLicense.save();
      return license;
    } catch (error) {
      throw error;
    }
  };

  update = async (license: License): Promise<License> => {
    try {
      const updateProperties = {
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
      };
      let licenseToUpdate = (await this.repository.findOneAndUpdate(
        {
          companyId: license.companyId,
        },
        updateProperties,
        { new: true }
      )) as License;
      if (!licenseToUpdate) {
        return null;
      }
      return licenseToUpdate;
    } catch (error) {
      throw error;
    }
  };

  delete = async (companyId: string) => {
    try {
      return await this.repository.deleteOne({ companyId: companyId });
    } catch (error) {
      return false;
    }
  };
}
