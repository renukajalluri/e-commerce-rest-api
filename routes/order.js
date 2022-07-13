const express = require('express');

const router = express.Router();
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken"); 
const Order = require('../models/Order');

// add order
router.post("/",verifyToken,async(req,res)=>{
    const newOrder = new Order(req.body)

    try {
       const savedOrder = await newOrder.save();
       res.status(200).json(savedOrder) 
    } catch (err) {
        res.status(500).json(err)
    }
})
// get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date(); //july
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));  //june
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));  //may
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// update
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
 
try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{new:true})
    res.status(200).json(updatedOrder)
} catch (error) {
    res.status(500).json({message:error})
}

})

// deleted
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    } catch (error) {
        res.status(500).json({message:error})
    }
})

// get user Orders
router.get("/:userId",verifyTokenAndAuthorization,async(req,res)=>{
    try {
     const  orders = await Order.findOne({userId:req.params.userId})
     res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({message:error})
    }
})

// get all orders
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const orders =await Order.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router