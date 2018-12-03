const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    try {
        let receivedToken = req.headers.authorization;
        console.log(receivedToken);

        let token = req.headers.authorization; //Bearer included
        if (token) {
            token = token.split(" ")[1]; // remove Bearer
        }

        const verifiedDecodedToken = jwt.verify(token, config.JWT_KEY);
        req.userExtractedData = verifiedDecodedToken; // to hold decoded user data into req.userExtractedData 
        // console.log(req.userExtractedData);
        const id = req.params.userId;
        if (id !== req.userExtractedData.userId) {
            console.log('valid token but invalid user');
            return res.status(401).json({
                success: 0,
                errorMsg: 'Invalid Token'
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: 0,
            errorMsg: 'Invalid Token'
        });
    }
};