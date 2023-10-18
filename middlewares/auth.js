const jwt = require("jsonwebtoken");

const User = require("../models/user")

exports.authentication = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const user = await jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = await User.findById(user.userId);
        req.user = userId;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ Error: "An error occurred" })
    }

}