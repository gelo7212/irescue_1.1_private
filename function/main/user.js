let users ={

}
let ioClients =[]
function search(nameKey, myArray,objName){
    return new Promise((resolve,reject)=>{
        let a =[]
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i][objName] == nameKey) {
                console.log('user' ,myArray[i] )
                a.push(myArray[i])
                //return resolve(myArray[i]);
            }
        }
        return resolve(a)
    })
}

module.exports = {
    users,
    ioClients,
    search
}