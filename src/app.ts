import dotenv from "dotenv";
import express, { Express } from "express";
import { accountRouter } from "./routes/accountRoutes";
import cors from "cors";
import { BankAccount } from "./models/bankAccount";
import { Money } from "./models/money";
import { CurrencyCode } from "./types/currencies";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

// routes
app.use(process.env.API_BASE + "account", accountRouter);

app.use(
  cors({
    origin: "*",
  })
);

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);

  const bankAcc: BankAccount = new BankAccount(
    "45168c2d-dfbe-452c-b259-5434452ced1d",
    "c7a532c1-1613-48ed-a331-41e6b573f65b",
    "Test Company",
    "Software Department",
    "NL68ABNA4398662022",
    new Money(1000, CurrencyCode.EUR)
  );
  bankAcc.recieve(new Money(1001, CurrencyCode.EUR)).then(() => {
    console.log(bankAcc.balance.toString());
  });
  bankAcc.send(new Money(2002, CurrencyCode.EUR)).then(() => {
    console.log(bankAcc.balance.toString());
  });
});
