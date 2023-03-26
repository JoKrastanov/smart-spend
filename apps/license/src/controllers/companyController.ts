import { Request, Response } from "express";
import { RegisterCompanyError } from "../errors/RegisterCompanyError";
import { CompanyService } from "../services/companyService";

export class CompanyController {
  private service: CompanyService;

  constructor() {
    this.service = new CompanyService();
  }

  getAllCompanies = (req: Request, res: Response) => {
    res.status(200).send(this.service.getCompanies());
  };

  getCompany = (req: Request, res: Response) => {
    const { id } = req.params;
    const company = this.service.getCompany(id);
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
      const { name, country, address } = req.body;
      const newCompany = this.service.registerCompany(name, country, address);
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
}
