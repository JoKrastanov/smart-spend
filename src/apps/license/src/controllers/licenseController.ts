import { Request, Response } from "express";
import { License } from "../models/license";
import { LicenseService } from "../services/licenseService";
import { LicenseTypes } from "../types/licenseTypes";

export class LicenseController {
  private service: LicenseService;

  constructor() {
    this.service = new LicenseService();
  }

  getAllLicenses = () => {
    return this.service.getAllLicenses();
  };

  subscribe = (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const {
        licenseType,
        requestedEmployeeNumber,
        requestedBankAccountNumber,
      } = req.body;
      let newLicense: License;
      if (
        licenseType === LicenseTypes.Enterprise &&
        requestedEmployeeNumber &&
        requestedBankAccountNumber
      ) {
        newLicense = this.service.issueLicense(
          companyId,
          licenseType,
          requestedEmployeeNumber,
          requestedBankAccountNumber
        );
      } else {
        newLicense = this.service.issueLicense(companyId, licenseType);
      }
      if (!newLicense) {
        res
          .status(404)
          .json({ message: "Error issuing license please try again!" });
        return;
      }
      res.status(201).json(newLicense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
