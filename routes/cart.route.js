const { Router } = require('express');
const { Cart } = require('../models/cart.model');
const { cartUserAuth } = require('../middlewares/cartAuth');


const cartRoute = Router();

cartRoute.use(cartUserAuth);

cartRoute.get("/", async (req, res) => {
    let { userID } = req.body;
    try {
        let data = await Cart.find({ userID });
        res.status(400).send({
            isError: false,
            data
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

cartRoute.post("/",async(req,res)=>{
    let {userID , productID , quantity} = req.body;
    try {
        let alreadyExistingProduct = await Cart.findOne({userID,productID});
        if(alreadyExistingProduct){
            res.status(400).send({
                isError: true,
                error:"product already exist in the cart"
            }) 
        }
        let data = new Cart({userID,productID,quantity});
        await data.save()
        res.status(400).send({
            isError: false,
            message:"product added into the cart"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

cartRoute.patch("/:id",async(req,res)=>{
    let {id} = req.params;
    try {
      await Cart.findByIdAndUpdate(id,req.body);
        res.status(400).send({
            isError: false,
            message:"cart updated successfully"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

cartRoute.patch("/:id", async (req, res) => {
    let { id } = req.params;
    try {
        await Cart.findByIdAndDelete(id);
        res.status(400).send({
            isError: false,
            message: "entry deleted successfully"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

module.exports = {cartRoute};