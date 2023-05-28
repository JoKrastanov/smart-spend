import crypto from "crypto";

export const generateUUID = async (): Promise<string> => {
  return await crypto.randomUUID();
};
