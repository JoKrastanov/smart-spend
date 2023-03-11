import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { Money } from "./money";

export class BankAccount {
  id: string;
  companyId: string;
  name: string;
  department: string;
  IBAN: string;
  balance: Money;
  reserved: Money;

  constructor(
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: Money,
    reserved: Money
  ) {
    this.id = generateUUID();
    this.companyId = companyId;
    this.name = name;
    this.department = department;
    this.IBAN = IBAN;
    this.balance = balance;
    this.reserved = reserved;
  }
}
