import { Request, Response } from "express";
import { License } from "../models/license";
import { LicenseService } from "../services/licenseService";
import { LicenseTypes } from "../types/licenseTypes";

export class LicenseController {
  private service: LicenseService;

  constructor() {
    this.service = new LicenseService();
  }

  getAllLicenses = (req: Request, res: Response) => {
    res.status(200).json(this.service.getAllLicenses());
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

  activate = (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const license = this.service.activateLicense(companyId);
      if (!license) {
        res.sendStatus(404);
      }
      res.status(200).json(license);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  registerEmployee = (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const {
        firstName,
        lastName,
        address,
        phone,
        country,
        email,
        password,
        department,
        accountType,
      } = req.body;
      this.service.registerEmployee(
        firstName,
        lastName,
        address,
        phone,
        country,
        companyId,
        email,
        password,
        department,
        accountType
      );
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error.getMessage() });
    }
  };

  registerBankAccount = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const { name, department, IBAN, balance, currency } = req.body;
      if (!name || !department || !IBAN || !balance || !currency) {
        res.status(400).json({ message: "Invalid data" });
        return;
      }
      const response = await this.service.registerBankAccount(
        companyId,
        name,
        department,
        IBAN,
        balance,
        currency
      );
      if (response === null) {
        res.status(500).json({
          message:
            "There was an error creating the bank account, please try again!",
        });
        return;
      }
      res.status(200).json({ messagee: "OK" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };
}
