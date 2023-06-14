import { CurrencyCode } from "../types/currencies";

export class Money {
  amount: number;
  currency: CurrencyCode;

  constructor(amount: number, currency: CurrencyCode, newMoney: boolean) {
    this.amount = newMoney === true ? amount * 100 : amount;
    this.currency = currency;
  }

  subtract = (amount: number) => {
    this.amount -= amount;
  };

  add = (amount: number) => {
    this.amount += amount;
  };

  getAmountConvertable = (): number => {
    return this.amount / 100;
  };

  toString = (): string => {
    return `${this.amount / 100} ${this.currency}`;
  };
}
