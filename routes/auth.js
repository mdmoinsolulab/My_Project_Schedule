const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { Validate } = require('../helpers/validation');
const {Enum} = require('../helpers/enumtypes');

//REGISTER
router.post("/register", Validate(Enum.REGISTERATION), async (req, res) => {
  const { username, email, password, vendor } = req.body;
  console.log("Why is it working")
  const newUser = new User({
    username: username,
    email: email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC
    ).toString(),
    isVendor: vendor,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', Validate(Enum.LOGIN), async (req, res) => {
    try{
      const {username, password} = req.body;
        const user = await User.findOne(
            {
                username: username
            }
        );


       !user && res.status(401).json("Wrong User Name");
      !user ? res.status(401).json("Wrong User Name") : console.log("There is a user")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = password;
        
        originalPassword != inputPassword && 
            res.status(401).json("Wrong Password");

        console.log("This is the User Fetched from database : ",user)
        
        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
            isVendor: user.isVendor,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
  
        const { removepassword, ...others } = user._doc;  
        res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err);
    }

});

module.exports = router;
