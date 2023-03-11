export enum LicenseTypes {
  Basic = "BASIC",
  Pro = "PRO",
  Enterprise = "ENTERPRISE",
}

export enum LicenseSettings {
  LicenceId = "licenseId",
  Price = "price",
  DatePurchased = "datePurchased",
  LicenseType = "licenseType",
}

export interface ILicense {
  [LicenseSettings.LicenceId]: string;
  [LicenseSettings.Price]: number;
  [LicenseSettings.DatePurchased]: Date;
  [LicenseSettings.LicenseType]: LicenseTypes;
}

export type ILicenseKeys = keyof ILicense;
