const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


module.exports = {
    hashPassword: async(password) => {
        return bcrypt.hash(password, 10);
    },
    validatePassword: async(password, hash) => {
        return bcrypt.compare(password, hash);
    },
    signToken: (payload)=> {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
    },
    verifyToken: (token)=> {
        return jwt.verify(token, JWT_SECRET);
    }
}


