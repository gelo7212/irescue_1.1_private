const email = require('./email/email')
const password =require('./password/password')
 const bcrypt = require('./bcrypt/bcrypt')
const jwt = require('./jwt/jwt')
const admin = require('./admin/admin')
const uuid = require('./jwt/uuid')
 module.exports = {
        email,
        password,
        bcrypt,
        jwt,
        uuid,
        admin
}