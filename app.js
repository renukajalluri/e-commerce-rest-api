const express = require("express");
const mongoose = require('mongoose')
const app = express();

const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product")
const orderRoute  = require("./routes/order")
const cartRoute  = require("./routes/cart")

dotenv.config()

app.use(express.json({extended:true}));

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    },(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Connected to MongoDB");
        }
   
});

app.use("/users",userRoute)
app.use("/auth",authRoute)
app.use("/products",productRoute)
app.use("/cart",cartRoute)
app.use("/orders",orderRoute)




app.listen(process.env.PORT || 5000,(err)=>{
   if(err){
    console.log(err);
   }else{
    console.log("server is listening on port 5000")
   }
})