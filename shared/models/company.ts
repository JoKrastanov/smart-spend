import { Country } from "../types/countries";

export class Company {
  id: string;
  name: string;
  country: Country;
  address: string;

  constructor(id: string, name: string, country: Country, address: string) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.address = address;
  }
}
