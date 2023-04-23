import mongoose, { Schema } from "mongoose";

const licenseSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  basePrice: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  datePurchased: {
    type: Number,
    required: true,
  },
  lastPayment: {
    type: Number,
    required: false,
    default: null
  },
  maxEmployeeNumber: {
    type: Number,
    required: true,
  },
  registeredEmployees: {
    type: Number,
    required: true,
  },
  pricePerEmployee: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  maxBankAccountsNumber: {
    type: Number,
    required: true,
  },
  registeredBankAccounts: {
    type: Number,
    required: true,
  },
  licenseType: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

licenseSchema.index({ companyId: 1 });

export const LicenseCollection = mongoose.model("Licenses", licenseSchema);
