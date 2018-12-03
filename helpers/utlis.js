const config = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Utlis = {
    hashPassword: function (inputPassword, callback) {
        const salt = 10;
        bcrypt.hash(inputPassword.toString(), salt, (err, hashedPw) => {
            if (err) {
                console.log(err);
                callback(false);
            } else {
                callback(hashedPw);
            }
        });
    },
    generateJWT: function (payload) {
        const token = jwt.sign(payload, config.JWT_KEY, {
            expiresIn: "1h"
        });
        return token;
    }
};

module.exports = Utlis;