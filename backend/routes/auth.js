const express = require('express')
var jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../schemas/user')
const {body,validationResult} = require("express-validator")
const bcrypt = require('bcryptjs');
const validator = require('validator');

const generateUserTag = async (name) => {
  let nametag;
  do {
    nametag = Math.floor(1000 + Math.random() * 9000);

    var existingUser = await User.findOne({ name,nametag });
  } while (existingUser);

  return nametag;
};

router.post(
    "/createuser",
    [
      body("name", "Enter a valid name").isLength({ min: 3 }),
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password must be atleast 5 characters").isLength({
        min: 5,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res
            .status(400)
            .json({ error: "Sorry , a user with this email already exists" });
        }
  
        //Produce secure password(hashed)
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        const usertag = await generateUserTag(req.body.name);

        //New user
        user = await User.create({
          name: req.body.name,
          password: secPass, 
          email: req.body.email,
          nametag: usertag,
        });
        const data = {
          user: {
            id: user.id,
          },
        };
        const accesstoken = createAccessToken(data);
        const refreshtoken = createRefreshToken(data);

        res.cookie('refreshtoken',refreshtoken,{
          httpOnly: true,
          path: "/refresh_token",
          maxAge:15 * 24 * 60 * 60 * 1000, //15 days valid
        });

        res.json({
          msg: "Registered Successfully",
          accesstoken,
         });
         
        //res.json(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
      }
    }
  );
  router.post(
    "/login",
    [
      body("logincred", "email or username cannot be blank").exists(),
      body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { logincred, password } = req.body;
      try {
        let user;
        if(validator.isEmail(logincred))
          user = await User.findOne({ email:logincred });
        else
        {
          const [name,nametag] = logincred.split('#');
          user = await User.findOne({name,nametag});
        }
        if (!user) {
          return res
            .status(400)
            .json({ error: "Please try to Login with correct credentials" });
        }
        const passcompare = await bcrypt.compare(password, user.password);
        if (!passcompare) {
          return res
            .status(400)
            .json({ error: "Please try to Login with correct credentials" });
        }
        const data = {
          user: {
            id: user.id,
          },
        };
        const access_token = createAccessToken(data);
        const refresh_token = createRefreshToken(data);
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/refresh_token",
          sameSite: 'lax',
          maxAge: 15 * 24 * 60 * 60 * 1000, //validity of 15 days
        });

        res.json({ 
          msg: "Login successful",
          access_token,
         });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
      }
    }
  );
  router.post(
    "/logout",    
    async (req, res) => {
    try {
        res.clearCookie("refreshtoken", { path: "/refresh_token" });
        return res.json({ msg: "Logged out Successfully." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
  //Route 3 to get the logged in user's details
 /* router.post("/getuser", fetchuser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error ...");
    }
  });
  */


  const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  };
  
  const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });
  };

  module.exports = router;