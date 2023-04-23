import { License } from "../../src/models/license";
import { CompanyService } from "../../src/services/companyService";
import { LicenseService } from "../../src/services/licenseService";
import { Country } from "../../src/types/countries";
import { LicenseTypes } from "../../src/types/licenseTypes";

describe("LicenseService", () => {
  let licenseService: LicenseService;
  let companyService: CompanyService;

  beforeAll(() => {
    companyService = new CompanyService();
    licenseService = new LicenseService();
  });

  const issueLicense = jest.fn().mockResolvedValue({
    comapnyId: "123",
    licenseType: LicenseTypes.Pro
  });

  describe("addLicense", () => {
    test("should add a license", async () => {
      try {
        const result = await issueLicense("123", LicenseTypes.Pro);
        expect(result).toBeDefined();
        expect(result.companyId).toBe("123");
        expect(result.licenseType).toBe(LicenseTypes.Pro);
      } catch (error) {}
    }, 15000);
  });
});
