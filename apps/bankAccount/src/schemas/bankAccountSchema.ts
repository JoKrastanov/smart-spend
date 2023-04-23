import mongoose, { Schema } from "mongoose";

const bankAccountSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  IBAN: {
    type: String,
    required: true,
  },
  balance: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
});

bankAccountSchema.index({ IBAN: 1 })

export const BankAccountCollection = mongoose.model(
  "BankAccounts",
  bankAccountSchema
);
