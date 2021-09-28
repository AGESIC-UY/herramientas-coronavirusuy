const fs = require('fs');

const publicKeyByPath = (path) => {
  const file = readFile(path);
  if (!file) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Public key not found');
    }
    return false;
  }
  return file;
};

const readFile = (path) => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(err);
    }
    return false;
  }
};

module.exports = {
  publicKeyByPath,
};
