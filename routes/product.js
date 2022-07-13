const express = require('express');
const CryptoJs  = require("crypto-js")

const router = express.Router();
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken"); 
const Porduct = require('../models/Product');
const Product = require('../models/Product');

// create product
router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct = new Product(req.body)

    try {
       const savedProduct = await newProduct.save();
       res.status(200).json(savedProduct) 
    } catch (error) {
        res.status(500).json(err)
    }
})





// update
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
 
try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    },{new:true})
    res.status(200).json(updatedProduct)
} catch (error) {
    res.status(500).json({message:error})
}

})

// deleted
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (error) {
        res.status(500).json({message:error})
    }
})

// get product
router.get("/:id",async(req,res)=>{
    try {
     const  product = await Product.findById(req.params.id)
     res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:error})
    }
})

// get all products
router.get("/",async(req,res)=>{
    const qNew = req.query.new
    const qCategory = req.query.category
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt:-1}).limit(1)
        }else if(qCategory){
            // if qCategory is inside array of categories in db,we fetch the products
            products = await Product.find({categories:{$in:[qCategory]}})
        }else{
            products = await Product.find();
        }
        res.status(200).json(products)
        // console.log(users)
    }catch(err){
        res.status(500).json({message:err})
    }
})



module.exports = router