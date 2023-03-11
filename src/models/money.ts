import { CurrencyCode } from "../types/currencies";

export class Money {
  amount: number;
  currency: CurrencyCode;

  constructor(amount: number, currency: CurrencyCode) {
    this.amount = amount * 100;
    this.currency = currency;
  }

    getFormatted = () : string => {
        return `${this.amount / 100} ${this.currency}`
  }
}
