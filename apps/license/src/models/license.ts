import { InvalidLicensePropertiesError } from "../errors/InvalidLicensePropertiesError";
import { generateLicenseID } from "../helpers/generateLicenseID";
import { getCurrentUtcTime } from "../helpers/getCurrentUTCTime";
import { CurrencyCode } from "../types/currencies";
import { LicenseTypes } from "../types/licenseTypes";
import { Money } from "./money";

export class License {
  id: string;
  companyId: string;
  basePrice: Money;
  datePurchased: number;
  lastPayment: number;
  maxEmployeeNumber: number;
  registeredEmployees: number;
  pricePerEmployee: Money;
  maxBankAccountsNumber: number;
  registeredBankAccounts: number;
  licenseType: LicenseTypes;
  active: boolean;

  constructor(
    companyId: string,
    datePurchased: number,
    licenseType: LicenseTypes,
    requestedEmployeeNumber?: number,
    requestedBankAccountNumber?: number
  ) {
    this.id = generateLicenseID();
    this.companyId = companyId;
    this.datePurchased = datePurchased;
    this.licenseType = licenseType;
    this.registeredBankAccounts = 0;
    this.registeredEmployees = 0;
    this.active = false;
    this.generateDefaultLicenseProperties(
      licenseType,
      requestedEmployeeNumber,
      requestedBankAccountNumber
    );
  }

  activateLicense = () => {
    this.active = true;
    this.lastPayment = getCurrentUtcTime();
  };

  generateDefaultLicenseProperties = (
    licenseType: LicenseTypes,
    requestedEmployeeNumber?: number,
    requestedBankAccountNumber?: number
  ) => {
    switch (licenseType) {
      case LicenseTypes.Basic:
        this.basePrice = new Money(24.99, CurrencyCode.EUR);
        this.pricePerEmployee = new Money(14.99, CurrencyCode.EUR);
        this.maxEmployeeNumber = 5;
        this.maxBankAccountsNumber = 2;
        break;
      case LicenseTypes.Pro:
        this.pricePerEmployee = new Money(9.99, CurrencyCode.EUR);
        this.basePrice = new Money(49.99, CurrencyCode.EUR);
        this.maxEmployeeNumber = 20;
        this.maxBankAccountsNumber = 3;
        break;
      case LicenseTypes.Enterprise:
        this.getEnterpriseLicense(
          requestedEmployeeNumber,
          requestedBankAccountNumber
        );
        break;
    }
  };

  getEnterpriseLicense = (
    requestedEmployeeNumber: number,
    requestedBankAccountNumber: number
  ) => {
    let startingEmployeeNumber = 50;
    let startingBankAccountNumber = 10;
    switch (true) {
      case requestedEmployeeNumber <= 100:
        this.pricePerEmployee = new Money(9.99, CurrencyCode.EUR);
        break;
      case requestedEmployeeNumber <= 500:
        this.pricePerEmployee = new Money(4.99, CurrencyCode.EUR);
        break;
      case requestedEmployeeNumber > 500:
        this.pricePerEmployee = new Money(2.99, CurrencyCode.EUR);
        break;
    }
    this.basePrice = new Money(69.99, CurrencyCode.EUR);
    this.maxEmployeeNumber = startingEmployeeNumber + requestedEmployeeNumber;
    this.maxBankAccountsNumber =
      startingBankAccountNumber + requestedBankAccountNumber;
  };

  getFullLicensePrice = (): Money => {
    const fullPrice =
      this.basePrice.amount +
      this.pricePerEmployee.amount * this.registeredEmployees;
    return new Money(fullPrice, CurrencyCode.EUR);
  };

  canRegisterEmployee = () => {
    return this.registeredEmployees < this.maxEmployeeNumber && this.active;
  };

  canAddBankAccount = () => {
    return (
      this.registeredBankAccounts < this.maxBankAccountsNumber && this.active
    );
  };
}