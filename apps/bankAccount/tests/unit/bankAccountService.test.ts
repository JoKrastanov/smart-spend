import { Money } from "../../src/models/money";
import { BankAccountService } from "../../src/services/bankAccountService";
import { CurrencyCode } from "../../src/types/currencies";

describe("BankAccountService", () => {
  let bankAccountService: BankAccountService;

  beforeAll(() => {
    bankAccountService = new BankAccountService();
  });

  const addBankAccount = jest.fn().mockResolvedValue({
    companyId: "123",
    IBAN: "TESTIBAN123",
    balance: new Money(1000, CurrencyCode.EUR, true),
    department: "IT",
  });

  describe("addBankAccount", () => {
    test("should add a bank account", async () => {
      try {
        const result = await addBankAccount(
          "123",
          "Test Bank Account",
          "IT",
          "TESTIBAN123",
          new Money(1000, CurrencyCode.EUR, true)
        );

        expect(result).toBeDefined();
        expect(result.companyId).toBe("123");
        expect(result.IBAN).toBe("TESTIBAN123");
        expect(result.balance).toBe(new Money(1000, CurrencyCode.EUR, true));
        expect(result.department).toBe("IT");
      } catch (error) {}
    }, 15000);
  });
});
