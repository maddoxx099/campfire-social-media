const Users = require("../schemas/user");

const userCtrl={
    searchUser: async (req,res)=> {
        try {
            const users = await Users.find({
                name: { $regex: req.body.name },
              })
                .limit(10)
                .select("name nametag");
        
              res.json({ users });
        } catch(err){
            return res.status(500).json({msg: err.message});
        }
    },

    getUser: async (req, res) => {
        try {
          const user = await Users.findById(req.params.id)
            .select("-password")
            .populate("followers following", "-password");
    
          if (!user) {
            return res.status(400).json({ msg: "requested user does not exist." });
          }
    
          res.json({ user });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },

      follow: async (req, res) => {
        try {
          const user = await Users.find({
            _id: req.params.id,
            followers: req.user._id,
          });
          if (user.length > 0)
            return res
              .status(500)
              .json({ msg: "You are already following this user." });
    
          const newUser = await Users.findOneAndUpdate(
            { _id: req.params.id },
            {
              $push: {
                followers: req.user._id
              },
            },
            { new: true }
          ).populate("followers following", "-password");
    
          await Users.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { following: req.params.id } },
            { new: true }
          );
    
          res.json({ newUser });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
      unfollow: async (req, res) => {
        try {
          const newUser = await Users.findOneAndUpdate(
            { _id: req.params.id },
            {
              $pull: { followers: req.user._id }
            },
            { new: true }
          ).populate('followers following', '-password');
    
          await Users.findOneAndUpdate(
            { _id: req.user._id },
            { $pull: { following: req.params.id } },
            { new: true }
          );
    
          res.json({ newUser });
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
    
}
module.exports = userCtrl;