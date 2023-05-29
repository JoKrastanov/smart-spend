import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";

export class UserAccountDTO {
  firstName: string;
  lastName: string;
  address: string;
  country: Country;
  phone: string;
  email: string;
  companyId: string;
  department: string;
  accountType: AccountType;

  constructor(
    firstName: string,
    lastName: string,
    address: string,
    country: Country,
    phone: string,
    email: string,
    companyId: string,
    department: string,
    accountType: AccountType
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.country = country;
    this.phone = phone;
    this.email = email;
    this.companyId = companyId;
    this.department = department;
    this.accountType = accountType;
  }
}
