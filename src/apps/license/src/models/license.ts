import { CurrencyCode } from "../types/currencies";
import { LicenseTypes } from "../types/licenseTypes";
import { Money } from "./money";

export class License {
  id: string;
  companyId: string;
  basePrice: Money;
  datePurchased: Date;
  lastPayment: Date;
  maxEmployeeNumber: number;
  registeredEmployees: number;
  pricePerEmployee: number;
  maxBankAccountsNumber: number;
  registeredBankAccounts: number;
  licenseType: LicenseTypes;

  constructor(
    id: string,
    companyId: string,
    price: Money,
    datePurchased: Date,
    licenseType: LicenseTypes
  ) {
    this.id = id;
    this.companyId = companyId;
    this.basePrice = price;
    this.datePurchased = datePurchased;
    this.licenseType = licenseType;
  }

  getFullLicensePrice = (): Money => {
    const fullPrice = this.basePrice.amount + (this.pricePerEmployee * this.registeredEmployees);
    return new Money(fullPrice, CurrencyCode.EUR)
  }

  canRegisterEmployee = () => {
    return this.registeredEmployees < this.maxEmployeeNumber;
  }

  canAddBankAccount = () => {
    return this.registeredBankAccounts < this.maxBankAccountsNumber;
  }
}
