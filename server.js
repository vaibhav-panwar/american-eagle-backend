const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {connection} = require('./db/mongodb');
const { redisConnect } = require('./db/redis');
const {userRoute} = require('./routes/user.route');
const {productRoute} = require('./routes/product.route');
const { productAdminAuth } = require('./middlewares/productAuth');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user',userRoute);
app.use('/product',productRoute);

app.get("/check",productAdminAuth,(req,res)=>{
    res.send("sab sahi chl raha hai");
})
app.listen(process.env.port,async()=>{
    try {
        await connection
        await redisConnect
        console.log(`server started at port ${process.env.port}`);
    } catch (error) {
        console.log(error);
    }
})