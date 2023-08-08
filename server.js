const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connection } = require('./db/mongodb');
const { redisConnect } = require('./db/redis');
const { userRoute } = require('./routes/user.route');
const { productRoute } = require('./routes/product.route');
const { cartRoute } = require('./routes/cart.route');
const { orderRouter } = require('./routes/order.route');
const { addressRoute } = require('./routes/address.route');


const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("base point");
})
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRouter);
app.use('/address', addressRoute);


app.listen(process.env.port, async () => {
    try {
        await connection
        await redisConnect
        console.log(`server started at port ${process.env.port}`);
    } catch (error) {
        console.log(error);
    }
})