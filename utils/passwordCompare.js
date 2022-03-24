import CryptoJS from 'crypto-js';

const passwordCompare = (originalPassword, inputPassword) => {

  // console.log('original pas',originalPassword, ' entered pass ', inputPassword)
const hashedPassword = CryptoJS.AES.decrypt(
    originalPassword,
    process.env.PASS_SEC
);

originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

// console.log(' Again original pas',originalPassword, ' entered pass ', inputPassword)

if (originalPassword != inputPassword) {
  return false;
}
else {
    return true;
}
}

export default passwordCompare;