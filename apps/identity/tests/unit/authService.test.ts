import { AuthService } from "../../src/services/authService";
import { AccountType } from "../../src/types/accountTypes";
import { Country } from "../../src/types/countries";

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = new AuthService();
  });

  describe("addUser", () => {
    test("should add a user", async () => {
      const result = await authService.addUser(
        "Joan",
        "Krastanov",
        "Test Address",
        "+31123456789",
        Country.Netherlands,
        "123",
        "test@test.com",
        "testpsw",
        "IT",
        AccountType.Admin
      );

      expect(result).toBeDefined();
      expect(result.user.companyId).toBe("123");
      expect(result.user.firstName).toBe("Joan");
      expect(result.user.department).toBe("IT");
      expect(result.user.email).toBe("test@test.com");
    });
  });
});
