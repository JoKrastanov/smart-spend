import axios from "axios";
import dotenv from "dotenv";
import { CurrencyCode } from "../../types/currencies";

dotenv.config();
const requestURL = process.env.CONVERT_CURRENCY_API_URL;

export const getConversionRate =  async (
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number | Error> => {
  const getUrl: string = requestURL + `convert?from=${from}&to=${to}`;
  try {
    const response = await axios.get(getUrl)
    return response.data.result
  } catch (error) {
    return new Error(error);
  }
};
