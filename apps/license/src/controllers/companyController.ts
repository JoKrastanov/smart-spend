import { Request, Response } from "express";
import { RegisterCompanyError } from "../errors/RegisterCompanyError";
import { CompanyService } from "../services/companyService";

export class CompanyController {
  private service: CompanyService;

  constructor() {
    this.service = new CompanyService();
  }

  getAllCompanies = async (req: Request, res: Response) => {
    const { token, refresh } = req.headers;
    if (!(await this.service.verifyBearerToken(token, refresh))) {
      return res.status(401).send("Unauthorized request");
    }
    res.status(200).send(await this.service.getCompanies());
  };

  getCompany = async (req: Request, res: Response) => {
    const { token, refresh } = req.headers;
    if (!(await this.service.verifyBearerToken(token, refresh))) {
      return res.status(401).send("Unauthorized request");
    }
    const { id } = req.params;
    const company = await this.service.getCompany(id);
    if (!company) {
      res
        .status(404)
        .json({ message: "Company with specified Id does not exist" });
      return;
    }
    res.status(200).send(company);
  };

  registerCompany = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers;
      if (!(await this.service.verifyBearerToken(token, refresh))) {
        return res.status(401).send("Unauthorized request");
      }
      const { name, country, address } = req.body;
      const newCompany = await this.service.registerCompany(
        name,
        country,
        address
      );
      if (!newCompany) {
        res
          .status(404)
          .send({ message: new RegisterCompanyError("error").getMessage() });
        return;
      }
      res.status(201).send(newCompany);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteCompany = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers;
      if (!(await this.service.verifyBearerToken(token, refresh))) {
        return res.status(401).send("Unauthorized request");
      }
      const { id } = req.params;
      const deleteStatus = await this.service.deleteCompany(id);
      if (!deleteStatus) {
        res.status(404).send({ message: "Error deleting company" });
        return;
      }
      res.status(200).send(deleteStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
