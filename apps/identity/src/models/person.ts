import { Country } from "../types/countries";

export class Person {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  country: Country;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    country: Country
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phone = phone;
    this.country = country;
  }
}
