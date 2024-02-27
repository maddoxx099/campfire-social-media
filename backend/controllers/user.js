const Users = require("../schemas/user");

const userCtrl={
    searchUser: async (req,res)=> {
        try {
            const users = await Users.find({
                name: req.body.name ,
              })
                .limit(10)
                .select("name nametag");
        
              res.json({ users });
        } catch(err){
            return res.status(500).json({msg: err.message});
        }
    }
}
module.exports = userCtrl;