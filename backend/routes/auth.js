const express = require('express')
var jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../schemas/user')
const {body,validationResult} = require("express-validator")
const bcrypt = require('bcryptjs');
const validator = require('validator');

const JWT_SECRET = process.env.JWT_SECRET

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
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
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
          user = await User.findOne({ logincred: req.body.email });
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
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
      }
    }
  );
  
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



  module.exports = router;