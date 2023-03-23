import { LicenseService } from "../services/licenseService";

export class LincenseController {
  private service: LicenseService;

  constructor() {
    this.service = new LicenseService();
  }
}
