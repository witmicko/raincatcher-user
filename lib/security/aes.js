var CryptoJS = require("crypto-js");

/**
* Encrypt an Object using AES with a specified secret key.
* @param {object} data - the data to encrypt.
* @param {string} key - the secret key to encrypt with.
* @returns {string} ciphertext
*/
function encrypt(data, key) {
  if (!data || !key) {
    throw Error("Cannot Encrypt Profile Data - Data or Secret key is Null.");
  }
  return CryptoJS.AES.encrypt(JSON.stringify(data), key);
}

/**
* Decrypt some ciphertext using AES with a specified secret key.
* @param {string} ciphertext - the ciphertext to decrypt.
* @param {string} key - the secret key to decrypt with.
* @returns {string/object} plaintext
*/
function decrypt(ciphertext, key) {

  if (!ciphertext || !key) {
    throw Error("Cannot Decrypt Profile Data - Ciphertext or Secret key is Null.");
  }

  var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), key);
  try {
    JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};
