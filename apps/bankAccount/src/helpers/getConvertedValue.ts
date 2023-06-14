import axios from "axios";
import dotenv from "dotenv";
import { Money } from "../models/money";
import { CurrencyCode } from "../types/currencies";

dotenv.config();
const requestURL = process.env.CONVERT_CURRENCY_API_URL;

export const getConvertedValue = async (
  from: CurrencyCode,
  to: CurrencyCode,
  amount: number
): Promise<Money> => {
  const getUrl: string =
    requestURL + `convert?from=${from}&to=${to}&amount=${amount}&places=2`;
  try {
    const response = await axios.get(getUrl);
    const convertedMoney = new Money(response.data.result, to, true);
    return convertedMoney;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
