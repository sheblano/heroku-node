const mongoose = require('mongoose');
var schema = mongoose.Schema;

const userSchema = new schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    username: String,
    password: String,
    profilePicUrl: String,

    accounts: [{
        number: String,
        accType: String,
        balance: Number,
        date: Date,
        transactions:[{
            trxType: String,
            date: Date,
            value: Number
        }]
    }],
}, {
    timestamps: true
});

let user = mongoose.model('user', userSchema);
module.exports = user;