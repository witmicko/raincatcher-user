var CryptoJS = require("crypto-js");

/**
* Generate a SHA256 hash value for some given text.
* @param {string} text - the text to generate a hash value.
* @returns {string} hash
*/
function hash(text) {
  if (!text) {
    throw Error("Cannot hash Session Key - Value to hash is Null.");
  }
  var hash = CryptoJS.SHA256(text);
  return hash.toString(CryptoJS.enc.Base64);
}

module.exports = {
  hash: hash
};
