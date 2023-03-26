import crypto from "crypto";

export const generateLicenseID = (): string => {
    return `SSLC-${crypto.randomUUID()}`;
} 