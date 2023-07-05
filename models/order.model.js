const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userID: {
        type: String,
        required: [true, 'userID not available']
    },
    products: {
        type: Array,
        required: true
    },
    addressID: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'processing', 'complete'],
            message: 'value is not acceptable'
        },
        default: 'pending',
        required: true
    }
},
{
    versionKey: false,
    timestamps: true
})

const Orders = mongoose.model("order", orderSchema);

module.exports = { Orders };