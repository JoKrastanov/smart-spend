import { CompanyService } from "../services/companyService";

export class CompanyController {
  private service: CompanyService;

  constructor() {
    this.service = new CompanyService();
  }
}
