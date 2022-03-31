import CryptoJS from 'crypto-js';

const passwordCompare = (originalPassword, inputPassword) => {
const hashedPassword = CryptoJS.AES.decrypt(
    originalPassword,
    process.env.PASS_SEC
);

originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

if (originalPassword != inputPassword) {
  return false;
}
else {
    return true;
}
}

export default passwordCompare;