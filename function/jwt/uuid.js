const uuidv1 = require('uuid/v1')
const uuidv5 = require('uuid/v5');
function generate(string) {
    const MY_NAMESPACE =uuidv1() ;
    console.log('v1 ' ,MY_NAMESPACE)
    return uuidv5(string, MY_NAMESPACE);
    
}
module.exports = {generate}
//e4714399-53e6-5221-8256-974df0e2872e
//'97f08720-ca2e-11e9-a14b-c9ddddc6d867'