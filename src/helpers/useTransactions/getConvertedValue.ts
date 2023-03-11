import axios from "axios";
import dotenv from "dotenv";
import { CurrencyCode } from "../../types/currencies";

dotenv.config();
const requestURL = process.env.CONVERT_CURRENCY_API_URL;

export const getConvertedValue = async (
  from: CurrencyCode,
  to: CurrencyCode,
  amount: number
): Promise<number | Error> => {
  const getUrl: string =
    requestURL + `convert?from=${from}&to=${to}&amount=${amount}`;
  try {
    const response = await axios.get(getUrl);
    return response.data.result;
  } catch (error) {
    return new Error(error);
  }
};
