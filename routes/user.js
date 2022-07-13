const express = require('express');
const CryptoJs  = require("crypto-js")

const router = express.Router();
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken"); 
const User = require('../models/User');

// update
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
  if(req.body.password){
    req.body.password = CryptoJs.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
  }

try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{new:true})
    res.status(200).json(updatedUser)
} catch (error) {
    res.status(500).json({message:error})
}

})

// deleted
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    } catch (error) {
        res.status(500).json({message:error})
    }
})

// get user stats
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try {
        const data = await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project:{
                    // take month number inside createdAt in db
                    month:{$month:"$createdAt"}
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(err)
    }
})

// get user
router.get("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try {
     const  user = await User.findById(req.params.id)
     const {password , ...others} = user._doc
     res.status(200).json({...others})
    } catch (error) {
        res.status(500).json({message:error})
    }
})

// get all users
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query = req.query.new
    try{
        const users =query ? await User.find().sort({_id:-1}).limit(5) : await User.find()
        res.status(200).json(users)
        // console.log(users)
    }catch(err){
        res.status(500).json({message:err})
    }
})



module.exports = router