const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcrypt')
//REGISTER
router.post("/register", async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt)
        const newuser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass
        })
        const user = await newuser.save();
        res.status(200).json(user);
    }catch(e){
        console.log(e)
        res.status(500).json(e);
    }
})
//LOGIN
router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username})
        !user && res.status(400).json("Wrong Credentials! ")
        const validate = await bcrypt.compare(req.body.password,user.password)
        !validate && res.status(400).json("Wrong Credentials!")
        const {password,...others} = user._doc
        res.status(200).json(others)
    }catch(e){
        console.log(e)
        res.sendStatus(500).json(e)
    }
})
module.exports = router