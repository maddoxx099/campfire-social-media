const Users = require('../schemas/user');
const jwt = require('jsonwebtoken');



const auth = async (req,res,next) => {
    try {
        const token = req.header("Authorization");

        if(!token){
            return res.status(400).json({ msg: "You are not authorized 1" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded)
        if (!decoded) {
          return res.status(400).json({ msg: "You are not authorized 2" });
        }

        const user = await Users.findOne({_id: decoded.user.id});
        
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}



module.exports = auth;