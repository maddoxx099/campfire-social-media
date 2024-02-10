const express = require('express')
var jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../schemas/user')
const {body,validationResult} = require("express-validator")
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET

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
  
        //New user
        user = await User.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email,
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
  module.exports = router;