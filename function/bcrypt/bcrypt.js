const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPlainPass (password){
    var salt = bcrypt.genSaltSync(saltRounds);
    return  bcrypt.hashSync(password, salt)
}
async function compareHash(myPlaintextPassword,hash){
    return await bcrypt.compare(myPlaintextPassword, hash);
}

module.exports = {hashPlainPass,compareHash}