const mongoose = require('mongoose');

// step 1 - @define fields
const fields = {
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type: String,
        required: true
    },
    phone : {
        type : String
    }
}

// step 2 - @wrap fields with mongoose schema
const userSchema = mongoose.Schema(fields, {timestamps : true});

// step 3 - @wrap schema with mongoose model
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;

