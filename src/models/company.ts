import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { Country } from "../types/countries";


export class Company {
  id: string;
  licenseId: string;
  name: string;
  country: Country;
  address: string;

  constructor(licenseId: string, name: string, country: Country, address: string) {
    this.id = generateUUID();
    this.licenseId = licenseId;
    this.name = name;
    this.country = country;
    this.address = address;
  }
}
