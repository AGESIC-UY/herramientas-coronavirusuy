const base45 = require("base45-js");
const zlib = require("pako");
const cbor = require("cbor");
const fs = require("fs");
const crypto = require("crypto");

/**
 * Parse QR base45 and cbor encoded.
 * @param {string} data Qr string
 * @param {string} DGC_V1_HEADER Prefix header
 * @returns Decoded object
 */
const parseQrCode = (data, DGC_V1_HEADER) => {
  const cleaned = cleanQRInput(data, DGC_V1_HEADER);

  if (!cleaned) {
    throw new Error("Invalid QR data");
  }

  try {
    const b45decoded = base45.decode(cleaned);
    const decompress = zlib.inflate(b45decoded);
    const decoded = cbor.decodeFirstSync(decompress);
    let [p, u, cwt, signers] = decoded.value;

    return {
      p,
      u,
      cwt,
      signers,
    };
  } catch (err) {
    throw new Error(`Error, malformed code: ${err}`);
  }
};

/**
 * Remove Qr prefix.
 * @param {string} data Qr string
 * @param {string} DGC_V1_HEADER Prefix to to remove
 * @returns Qr string without prefix.
 */
const cleanQRInput = (data, DGC_V1_HEADER) => {
  let result = null;
  if (data.startsWith(DGC_V1_HEADER)) {
    result = data.substring(DGC_V1_HEADER.length);
  }
  return result;
};

/**
 * Read public key as string.
 * @param {string} path Path to public key file.
 * @returns String representation.
 */
const publicKeyByPath = (path) => {
  const file = readFile(path);
  if (!file) {
    throw new Error("Public key not found");
  }
  return file;
};

/**
 * Read a file.
 * @param {string} path Path to file.
 * @returns String representation.
 */
const readFile = (path) => {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    throw new Error(`File not found: ${err}`);
  }
};

/**
 * Verify Qr sign data.
 * @param {string} QRData Qr string.
 * @param {string} publicKey String representation of a key.
 * @param {string} DGC_V1_HEADER Header prefix.
 * @param {number} KEY_DATA_VALUES Default map index data.
 * @returns JSON data or empty array.
 */
const verifyQRData = (
  QRData,
  publicKey,
  DGC_V1_HEADER = "HC1:",
  KEY_DATA_VALUES = 99
) => {
  try {
    let { p, u, cwt, signers } = parseQrCode(QRData, DGC_V1_HEADER);
    u = !u.size ? Buffer.alloc(0) : u;

    const sigStructure = ["Signature1", p, u, cwt];
    const toBeSigned = cbor.encode(sigStructure);
    const verify = crypto.createVerify("sha256WithRSAEncryption");
    verify.update(toBeSigned);

    let valid = verify.verify(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      signers
    );

    let data = [];
    if (valid) {
      let decodedData = cbor.decode(cwt);
      decodedData = decodedData.get(KEY_DATA_VALUES);

      if (decodedData) {
        data = JSON.parse(decodedData);
      } else {
        valid = false;
      }
    }

    return {
      data,
      valid,
    };
  } catch (err) {
    throw new Error(`There was a problem verifying the signature: ${err}`);
  }
};

module.exports = {
  cleanQRInput,
  parseQrCode,
  publicKeyByPath,
  verifyQRData,
};
