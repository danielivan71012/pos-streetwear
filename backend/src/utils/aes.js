const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey() {
  const encodedKey = process.env.AES_KEY_BASE64;

  if (!encodedKey) {
    throw new Error("AES_KEY_BASE64 no está configurada");
  }

  const key = Buffer.from(encodedKey, "base64");

  if (key.length !== 32) {
    throw new Error("AES_KEY_BASE64 debe representar exactamente 32 bytes");
  }

  return key;
}

function encryptText(plainText) {
  if (typeof plainText !== "string" || plainText.length === 0) {
    throw new Error("El texto a cifrar es inválido");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

function decryptText(encryptedPayload) {
  if (typeof encryptedPayload !== "string") {
    throw new Error("El payload cifrado es inválido");
  }

  const [ivBase64, authTagBase64, cipherTextBase64] = encryptedPayload.split(":");

  if (!ivBase64 || !authTagBase64 || !cipherTextBase64) {
    throw new Error("El payload cifrado no tiene el formato esperado");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivBase64, "base64")
  );

  decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherTextBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

module.exports = { encryptText, decryptText };
