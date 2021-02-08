const os = require('os');
var os_utils = require('os-utils');

function totalmem(){
    var tm =os.totalmem()
    
        return  tm
}
function freemem(){
    var fm =os.freemem()
    
        return  fm
}
function cpuAverage() {
    var cpus = os.cpus();
	
    var user = 0;
    var nice = 0;
    var sys = 0;
    var idle = 0;
    var irq = 0;
    var total = 0;
	
    for(var cpu in cpus){
		
        user += cpus[cpu].times.user;
        nice += cpus[cpu].times.nice;
        sys += cpus[cpu].times.sys;
        irq += cpus[cpu].times.irq;
        idle += cpus[cpu].times.idle;
    }
	
    var total = user + nice + sys + idle + irq;
	
    return {
        'idle': idle, 
        'total': total
    };
  }
  
  //Grab first CPU Measure

    var startMeasure = cpuAverage();
var CPU = function () {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
        // http://stackoverflow.com/questions/24928846/get-return-value-from-settimeout
    var promise = new Promise(function (resolve, reject) { 
        //Set delay for second Measure
        var stats1 = cpuAverage();
        var startIdle = stats1.idle;
        var startTotal = stats1.total;
        setTimeout(function() { 
            //Grab second Measure
            var stats2 = cpuAverage();
            var endIdle = stats2.idle;
            var endTotal = stats2.total;
            var idle 	= endIdle - startIdle;
            var total 	= endTotal - startTotal;
            var usagePer=~~((1-(idle / total))*100);
            var freePer =~~(100 - ~~(100 * idle / total));
            //var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
            resolve(usagePer);

        }, 100);


    });
return promise;
}
function cpu_mem(){
    os_utils.cpuUsage(function(v){
    })
    os_utils.cpuFree(function(v){
    })
}
module.exports = {totalmem,freemem,CPU}