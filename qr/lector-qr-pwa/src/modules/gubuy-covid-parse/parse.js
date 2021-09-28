const base45 = require('base45-js');
const zlib = require('pako');
const cbor = require('cbor');

const parseQrCode = (data, DGC_V1_HEADER) => {
  const cleaned = cleanQRInput(data, DGC_V1_HEADER);

  if (!cleaned) {
    throw new Error('Invalid QR data');
  }

  const b45decoded = base45.decode(cleaned);
  const decompress = zlib.inflate(b45decoded);

  try {
    const decoded = cbor.decode(decompress);
    let [p, u, cwt, signers] = decoded.value;

    return {
      p,
      u,
      cwt,
      signers,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(err);
    }
    return false;
  }
};

const cleanQRInput = (data, DGC_V1_HEADER) => {
  let result = null;
  if (data.startsWith(DGC_V1_HEADER)) {
    result = data.substring(DGC_V1_HEADER.length);
  }
  return result;
};

module.exports = {
  cleanQRInput,
  parseQrCode,
};
