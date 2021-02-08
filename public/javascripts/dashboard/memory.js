 function percentageOf(fm,tm){
    var qoutient = fm/tm
    return  (qoutient*100).toString().match(/^-?\d+(?:\.\d{0,0})?/)[0]// Math.round(qoutient*100)
  }
 function toGB(bytes){
    bytes = bytes/(1024*1024*1024)
    return  Math.round(bytes*100)/100
}
 function useMemory(tm,fm){
    return  tm - fm
}
