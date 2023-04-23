import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

companySchema.index({ id: 1 });

export const CompanyCollection = mongoose.model("Company", companySchema);
