import { Money } from "../../src/models/money";
import { BankAccountService } from "../../src/services/bankAccountService";
import { CurrencyCode } from "../../src/types/currencies";

describe("BankAccountService", () => {
  let bankAccountService: BankAccountService;

  beforeAll(() => {
    bankAccountService = new BankAccountService();
  });

  describe("addBankAccount", () => {
    test("should add a bank account", async () => {
      const result = await bankAccountService.addBankAccount(
        "123",
        "Test Bank Account",
        "IT",
        "TESTIBAN123",
        new Money(1000, CurrencyCode.EUR, true)
      );

      expect(result).toBeDefined();
      expect(result.companyId).toBe("123");
      expect(result.IBAN).toBe("TESTIBAN123");
      expect(JSON.stringify(result.balance)).toBe(
        JSON.stringify(new Money(1000, CurrencyCode.EUR, true))
      );
      expect(result.department).toBe("IT");
    });
  });
});
