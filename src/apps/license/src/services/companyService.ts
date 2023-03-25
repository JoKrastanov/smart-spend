import { generateUUID } from "../helpers/generateUUID";
import { Company } from "../models/company";
import { Country } from "../types/countries";

export class CompanyService {
    companies: Company[];

    constructor () {
        this.companies = [];
    }

    registerCompany = (name: string, country: Country, address: string): Company | null => {
        const newCompany = new Company(generateUUID(), name, country, address);
        this.companies.push(newCompany);
        return newCompany;
    }

    getCompanies = () => {
        return this.companies;
    }

    getCompany = (id: string) => {
        return this.companies.find(company => company.id === id);
    }
}