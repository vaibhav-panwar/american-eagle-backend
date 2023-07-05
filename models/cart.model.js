const mongoose = require('mongoose');

const cartSchema =new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    productID: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    }
},
{
    versionKey:false
})

const Cart = mongoose.model("cart",cartSchema);

module.exports = {Cart};