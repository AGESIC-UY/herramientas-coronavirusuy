const cbor = require('cbor-web');
const crypto = require('crypto');
const {parseQrCode} = require('./parse');

const verifyQRData = (
  QRData,
  publicKey,
  DGC_V1_HEADER = 'HC1:',
  KEY_DATA_VALUES = 99
) => {
  try {
    let {p, u, cwt, signers} = parseQrCode(QRData, DGC_V1_HEADER);
    u = !u.size ? Buffer.alloc(0) : u;

    const sigStructure = ['Signature1', p, u, cwt];
    const toBeSigned = cbor.encode(sigStructure);
    const verify = crypto.createVerify('sha256WithRSAEncryption');
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
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`There was a problem verifying the signature: ${err}`);
    }
    return {
      'data': [],
      'valid': false,
    };
  }
};

module.exports = {
  verifyQRData,
};
