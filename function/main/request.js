let requests = []
async function count(time){try {
    return new Promise((resolve, reject) => {
        var now = Date.now();
        var Ago = now - (1000 * time);
        var cnt = 0;
        // since recent requests are at the end of the array, search the array
        // from back to front
        for (var i = requests.length - 1; i >= 0; i--) {
            if (requests[i] >= Ago) {
                ++cnt;
                console.log(cnt, process.pid);
            }
            else {
                break;
            }
        }
        return resolve(cnt);
    });
}
catch (err) {
    console.log(err);
}
}
var requestTrimThreshold = 5000;
var requestTrimSize = 4000;
async function messageHandler(msg) {
    try {
        console.log('Request 1' ,msg)
        if (msg.cmd == 'notifyRequest') {
            console.log('Request 2' ,msg)
            requests.push(Date.now());
            if (requests.length > requestTrimThreshold) {
                requests = requests.slice(0, requests.length - requestTrimSize);
            }
        } 
    } catch (error) {
        console.log(error)
    }

}
module.exports ={
    count,
    requests,
    messageHandler
}