import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { Company } from "../models/company";
import { Country } from "../types/countries";

export class CompanyService {
    constructor () {}

    registerCompany = (name: string, country: Country, address: string): Company | null => {
        const newCompany = new Company(generateUUID(), name, country, address);
        return newCompany;
    }
}