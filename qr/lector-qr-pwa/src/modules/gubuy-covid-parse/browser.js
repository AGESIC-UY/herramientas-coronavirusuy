const { parseQrCode } = require('./parse');
const cbor = require('cbor');

const verifyQRData = async (
  QRData,
  publicKey,
  DGC_V1_HEADER = 'HC1:',
  KEY_DATA_VALUES = 99
) => {
  try {
    let { p, u, cwt, signers } = parseQrCode(QRData, DGC_V1_HEADER);
    u = !u.size ? Buffer.alloc(0) : u;

    const sigStructure = ['Signature1', p, u, cwt];
    const toBeSigned = cbor.encode(sigStructure);

    let data = [];
    const pkImport = await importPublicKey(publicKey);
    let valid = await verifyMessage(pkImport, signers, toBeSigned);

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

const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const importPublicKey = (pem) => {
  try {
    const binaryDerString = window.atob(clearPublicKey(pem));
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-PSS',
        hash: 'SHA-256',
      },
      false,
      ['verify']
    );
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Error creating Public Key: ' + e)
    }
    return false;
  }
};

const verifyMessage = (publicKey, signature, encoded) => {
  try {
    return publicKey ? window.crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32, //the length of the salt
      },
      publicKey,
      signature,
      encoded
    ) : false;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Error verifying signature: ' + e)
    }
    return false;
  }
};

const clearPublicKey = (pem) => {
  try {
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const data = pem.split(pemHeader)[1];
    return data.split(pemFooter)[0];
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Error reading PEM: ' + e)
    }
    return false;
  }
};

module.exports = {
  verifyQRData,
};
