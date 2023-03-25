import { LicenseService } from "../services/licenseService";

export class LicenseController {
  private service: LicenseService;

  constructor() {
    this.service = new LicenseService();
  }

  subscribeBasic = (req, res) => {
    try {
        
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  subscribePro = (req, res) => {
    try {
        
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  subscribeEnterprise = (req, res) => {
    try {
        
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
