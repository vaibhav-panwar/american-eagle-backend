const mongoose = require('mongoose');

let addressSchema =new mongoose.Schema({
    type:{
        type:String,
        enum:{
            values:['Home','Work','Other'],
            message:'type of address not provided'
        },
        required:true
    },
    name:{
        type:String,
        required:[true,'name of the address not provided']
    },
    phoneNo:{
        type:Number,
        required:[true,'phoneNo not provided']
    },
    address:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    }
},
{
    versionKey:false,
    timestamps:true
})

const Address = mongoose.model('address',addressSchema);

module.exports = {Address};