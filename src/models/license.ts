import { LicenseTypes } from "../types/licenseTypes";
import { Money } from "./money";

export class License {
  id: string;
  companyId: string;
  price: Money;
  datePurchased: Date;
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
    this.price = price;
    this.datePurchased = datePurchased;
    this.licenseType = licenseType;
  }
}
