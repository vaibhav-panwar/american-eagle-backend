const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    name: {
        type: String
        , required: [true, 'name field is empty']
    },
    email: {
        type: String,
        required: [true, 'email field is empty'],
        unique: true
    },
    password :{
        type:String,
        required:[true, 'password field is empty']
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    }
},
{
    versionKey:false,
    timestamps:true
})

const User = mongoose.model('user',userSchema);

module.exports = {User};
