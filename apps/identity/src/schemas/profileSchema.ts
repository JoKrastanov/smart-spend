import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
});

userSchema.index({ email: 1 });

export const UserCollection = mongoose.model("Users", userSchema);
