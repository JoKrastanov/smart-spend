import { InsufficientBalanceError } from "../errors/InsufficientBalanceError";
import { getConvertedValue } from "../helpers/getConvertedValue";
import { CurrencyCode } from "../types/currencies";
import { Money } from "./money";

export class BankAccount {
  id: string;
  companyId: string;
  name: string;
  department: string;
  IBAN: string;
  balance: Money;

  constructor(
    id: string,
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: Money
  ) {
    this.id = id;
    this.companyId = companyId;
    this.name = name;
    this.department = department;
    this.IBAN = IBAN;
    this.balance = balance;
  }

  checkCurrency = (currency: CurrencyCode): boolean => {
    if (currency === this.balance.currency) return true;
    return false;
  };

  checkBalance = (amount: number): boolean | InsufficientBalanceError => {
    if (this.balance.amount >= amount) return true;
    throw new InsufficientBalanceError("Not enought balance");
  };

  send = async (money: Money) => {
    try {
      if (!this.checkCurrency(money.currency)) {
        const convertedMoney = await getConvertedValue(
          money.currency,
          this.balance.currency,
          money.getAmountConvertable()
        );
        if (
          convertedMoney instanceof Money &&
          this.checkBalance(money.amount)
        ) {
          this.balance.subtract(convertedMoney.amount);
        }
        return;
      }
      if (this.checkBalance(money.amount)) {
        this.balance.subtract(money.amount);
        return;
      }
    } catch (err) {
      if (err instanceof InsufficientBalanceError) {
        console.log(err.getMessage());
      }
    }
  };

  recieve = async (money: Money) => {
    try {
      if (!this.checkCurrency(money.currency)) {
        const convertedMoney = await getConvertedValue(
          money.currency,
          this.balance.currency,
          money.getAmountConvertable()
        );
        if (!(convertedMoney instanceof Money)) return;
        this.balance.add(convertedMoney.amount);
        return;
      }
      this.balance.add(money.amount);
      return;
    } catch (Error) {
      console.log(Error);
    }
  };
}