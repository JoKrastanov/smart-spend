import mongoose, { Schema } from "mongoose";
import { AccountType } from "../types/accountTypes";
import { Country } from "../types/countries";

const companySchema = new Schema({
   
})


export const CompanyCollection = mongoose.model("Company", companySchema)
