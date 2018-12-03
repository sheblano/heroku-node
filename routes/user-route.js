const config = require('../config');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Utlis = require('../helpers/utlis');
const checkAuth = require('../middeware/auth');

module.exports = function (app) {
    const userRouteUrlPrefix = config.USER_BASE_ROUTE;

    /**
     * Ping Server API
     * API is NOT protected
     */
    app.get('/', (req, res) => {
        res.json({
            "message": "welcome to my app"
        });
    });

    /**
     * Add random users to the database for testing the app
     * API is NOT protected
     */
    app.get(`${userRouteUrlPrefix}/adduser`, (req, res) => {
        const random = Math.floor(Date.now() / 1000); // timestamp in seconds
        Utlis.hashPassword(random, (hashedPass) => {
            const user = new User({
                firstName: `Test ${random}`,
                lastName: 'User',
                email: `test${random}@shebl.com`,
                phoneNumber: `+201142252399`,
                username: `test${random}`,
                password: hashedPass,
                profilePicUrl: 'https://s3-us-west-1.amazonaws.com/co-directory-images/john-sample-395b3514.jpg',

                accounts: [{
                        number: (random + 1000).toString(),
                        accType: 'Payroll',
                        balance: Math.floor(Math.random() * 50000),
                        date: new Date,
                        transactions: [{
                                trxType: 'in',
                                date: new Date,
                                value: 1000
                            },
                            {
                                trxType: 'out',
                                date: new Date,
                                value: 5000
                            }
                        ]
                    },
                    {
                        number: (random + 2000).toString(),
                        accType: 'Saving Account',
                        balance: Math.floor(Math.random() * 20000),
                        date: new Date,
                        transactions: [{
                                trxType: 'in',
                                date: new Date,
                                value: 3000
                            },
                            {
                                trxType: 'out',
                                date: new Date,
                                value: 2500
                            }
                        ]
                    }
                ]
            });

            user.save().then(result => {
                // console.log(result);
                res.status(201).json({
                    success: 1,
                    result: user
                })
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    success: 0,
                    errorMsg: err
                })
            })
        })

    });

    /**
     * Get the user details 
     * @input user._id
     * API is NOT protected
     */
    app.get(`${userRouteUrlPrefix}/:userId`, checkAuth, (req, res) => {
        const id = req.params.userId;
        User.findById(id).exec()
            .then(result => {
                // console.log(result);
                if (result) {
                    res.status(200).json({
                        success: 1,
                        result: result
                    });
                } else {
                    res.status(404).json({
                        success: 0,
                        errorMsg: 'no data found for this user id'
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: 0,
                    errorMsg: err
                });
            })
    });


    /**
     * User loign 
     * @input user.username
     * @input user.password
     * API is protected by token
     */
    app.post(`${userRouteUrlPrefix}/login`, (req, res) => {
        User.find({
                username: req.body.username
            }).exec()
            .then(user => {
                if (user.length < 1) {
                    return res.status(401).json({
                        success: 0,
                        errorMsg: 'authentication failure'
                    });
                    console.log('1');
                }
                bcrypt.compare(req.body.password, user[0].password, (err, response) => {
                    if (err) {
                        return res.status(401).json({
                            success: 0,
                            errorMsg: 'authentication failure'
                        });
                        console.log('2');
                    }
                    // response = true;
                    if (response) { // if password is correct
                        const token = Utlis.generateJWT({
                            email: user[0].email,
                            userId: user[0]._id
                        })
                        return res.status(200).json({
                            success: 1,
                            token: token
                        })
                    } else { // if password is incorrect
                        return res.status(401).json({
                            success: 0,
                            errorMsg: 'authentication failure'
                        });
                        console.log('3');
                    }
                });

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: 0,
                    errorMsg: err
                })
            });
    });
}