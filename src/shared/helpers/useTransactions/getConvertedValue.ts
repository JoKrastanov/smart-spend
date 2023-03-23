// import axios from "axios";
// import dotenv from "dotenv";
// import { Money } from "../../shared/models/money";
// import { CurrencyCode } from "../../shared/types/currencies";

// dotenv.config();
// const requestURL = process.env.CONVERT_CURRENCY_API_URL;

// export const getConvertedValue = async (
//   from: CurrencyCode,
//   to: CurrencyCode,
//   amount: number
// ): Promise<Money | Error> => {
//   const getUrl: string =
//     requestURL + `convert?from=${from}&to=${to}&amount=${amount}&places=2`;
//   try {
//     const response = await axios.get(getUrl);
//     const convertedMoney = new Money(response.data.result, to);
//     return convertedMoney;
//   } catch (error) {
//     return new Error(error);
//   }
// };
