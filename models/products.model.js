const mongoose  = require('mongoose');

const productSchema =new mongoose.Schema({
    title:{
        type:String,
        required:[true , "empty field"]
    },
    image1:{
        type: String,
        required: [true, "empty field"]
    },
    image2:{
        type: String,
        required: [true, "empty field"]
    },
    gender:{
        type: String,
        enum: {
            values: ['male', 'female'],
            message: 'enter correct gender'
        },
        required: [true, "empty field"]
    },
    category:{
        type: String,
        required: [true, "empty field"]
    },
    price:{
        type: Number,
        required: [true, "empty field"]
    },
    description:{
        type: String,
        required: [true, "empty field"]
    },
    size:{
        type:Array,
        required:true
    },
    discount:{
        type: Number,
        required: [true, "empty field"]
    },
    quantity:{
        type: Number,
        required: [true, "empty field"]
    }
},{
    versionKey:false,
    timestamps:true
})

const Product = mongoose.model("product",productSchema);

module.exports = {Product};