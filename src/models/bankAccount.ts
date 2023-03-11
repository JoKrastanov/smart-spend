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
    id: string,
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: Money,
    reserved: Money
  ) {
    this.id = id;
    this.companyId = companyId;
    this.name = name;
    this.department = department;
    this.IBAN = IBAN;
    this.balance = balance;
    this.reserved = reserved;
  }
}
