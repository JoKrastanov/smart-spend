import { encryptPassword } from "../helpers/usePasswordHandling/encryptPassword";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";
import { Person } from "./person";

export class UserAccount extends Person {
  email: string;
  password: string;
  passwordSalt: string;
  companyId: string;
  department: string;
  accountType: AccountType;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    country: Country,
    companyId: string,
    email: string,
    password: string,
    salt: string,
    department: string,
    accountType: AccountType
  ) {
    super(id, firstName, lastName, address, phoneNumber, country);
    this.email = email;
    this.password = password;
    this.passwordSalt = salt;
    this.companyId = companyId;
    this.department = department;
    this.accountType = accountType;
  }
}
