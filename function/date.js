Date.prototype.toShortFormat = function () {

    var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
    
    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();
    
    return "" + day + "-" + month_names[month_index] + "-" + year;
}

// Now any Date object can be declared 
var today = new Date().toShortFormat();

module.exports = { today}