import { Country } from "../types/countries";

export class Person {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  country: Country;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    country: Country
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.country = country
  }
}
