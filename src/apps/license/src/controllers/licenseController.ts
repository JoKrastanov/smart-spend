import { LicenseService } from "../services/licenseService";

export class LicenseController {
  private service: LicenseService;

  constructor() {
    this.service = new LicenseService();
  }

  register = (req, res) => {
    try {
        
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
