import dotenv from "dotenv";
import express, { Express } from "express";
import { accountRouter } from "./routes/accountRoutes";
import cors from "cors";
import { BankAccount } from "./models/bankAccount";
import { Money } from "./models/money";
import { CurrencyCode } from "./types/currencies";
import { Company } from "./models/company";
import { generateUUID } from "./helpers/useUUIDHandling/generateUUID";
import { Country } from "./types/countries";
import { getConvertedValue } from "./helpers/useTransactions/getConvertedValue";

dotenv.config();
const app: Express = express();
const PORT: String | number = process.env.PORT || 3000;

// routes
app.use(process.env.API_BASE + "account", accountRouter);

app.use(
  cors({
    origin: "*",
  })
);

app.listen(PORT, async () => {
  console.log("Server is running at port:", PORT);

  const company: Company = new Company(
    generateUUID(),
    "Tesla",
    Country.Netherlands,
    "Eindhoven, Wal 12"
  );

  const bankAcc: BankAccount = new BankAccount(
    generateUUID(),
    company.id,
    "Test Account",
    "Software Department",
    "NL68ABNA4398662022",
    new Money(1000, CurrencyCode.EUR)
  );

  const bankAcc1: BankAccount = new BankAccount(
    generateUUID(),
    company.id,
    "Test Account",
    "Management Department",
    "NL68ABNA4398662022",
    new Money(1000, CurrencyCode.EUR)
  );

  await bankAcc.send(new Money(500, CurrencyCode.USD));
  await bankAcc1.recieve(new Money(500, CurrencyCode.USD));

  console.log(
    await (
      await getConvertedValue(CurrencyCode.USD, CurrencyCode.EUR, 500)
    ).toString()
  );

  console.log(bankAcc.balance.toString());
  console.log(bankAcc1.balance.toString());
});
