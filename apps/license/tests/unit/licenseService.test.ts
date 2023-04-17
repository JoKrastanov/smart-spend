import { LicenseService } from "../../src/services/licenseService";
import { LicenseTypes } from "../../src/types/licenseTypes";

describe("AuthService", () => {
  let licenseService: LicenseService;

  beforeAll(() => {
    licenseService = new LicenseService();
  });

  describe("addLicense", () => {
    test("should add a license", async () => {
      const result = licenseService.issueLicense("123", LicenseTypes.Pro);

      expect(result).toBeDefined();
      expect(result.companyId).toBe("123");
      expect(result.licenseType).toBe(LicenseTypes.Pro);
    });
  });
});
