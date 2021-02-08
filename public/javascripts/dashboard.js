/* globals Chart:false, feather:false */


(function () {
  'use strict'
  feather.replace()
  var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
  };
  // Graphs
//var oar2= document.getElementById('overallrepor2t').getContext('2d')
var oar= document.getElementById('overallreport').getContext('2d')
var ctx = document.getElementById('myChart').getContext('2d')
var dataIs = 0
var requestCount = 0
function myGetTime() {
  var dd = new Date();
  var hh = dd.getHours();
  var mm = dd.getMinutes();
  var ss = dd.getSeconds();
  return hh + ":" + mm + ":" + ss;
}
  // eslint-disable-next-line no-unused-vars
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        
      ],
      datasets: [{
        label:'CPU Usage',
        data: [
         
        ],
        lineTension: 0,
        borderColor: '#007bff',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff'
      },{
        label:'Memory Usage',
        data: [
         
        ],
        lineTension: 0,
        borderColor: 'rgb(128,0,128)',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff'
      }]
    },
    options: {
      responsives:true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: true
      }
    }
  })
  var myDoughnutChart = new Chart(oar, {
    type: 'line',
    data: {
      labels: [
        
      ],
      datasets: [{
        label:'Request',
        data: [
         
        ],
        lineTension: 0,
        borderColor: '#007bff',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff'
      }]
    },
    options: {
      responsives:true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: true
      }
    }
  });
  /* var myDoughnutChart2 = new Chart('', {
    type: 'polarArea',
    data: {
      datasets: [{
          data: [10, 20, 30],
          backgroundColor: [
            "rgba(255, 87, 34, 0.7)",
            "rgba(3, 169, 244, 0.5)",
            "rgba(233, 30, 99, 0.5)"
          ],
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Red',
          'Yellow',
          'Blue'
      ]
  }
  }); */
  var request = io.connect('/request',{
    query: {token: getCookie('_d.r')}
  });
  request.on('connect', function () {
    console.log('User connected!');
  });
  request.on('request', function (request) {
    add_request(myDoughnutChart,myGetTime(),request.data)
  });
  window.socket_memory = io.connect('/memory',{
    query: {token: getCookie('_d.r')}
  });
  socket_memory.on('connect', function () {
    console.log('User connected!');
  });
  socket_memory.on('connect_error', (error) => {
    console.log(error)
  });
  socket_memory.on('error', (error) => {
    console.log(error)
  });
  socket_memory.on('memory', function (memory) {
    var tm = toGB(memory.totalmem)
    var fm = toGB(memory.freemem)
    var cpu = memory.cpuPercentage
  
    var um = useMemory(tm,fm)
    addData(myChart,myGetTime(),cpu,percentageOf(um,tm))
    $('#perc').text(cpu+'%');
    $('#tm').text((tm)+ ' Gb');
    $('#fm').text((um)+ ' Gb'+' ('+percentageOf(um,tm)+'%)');
  });
  socket_memory.off('memory', function (mess) {
    console.log(mess)
  });

 
function add_request(chart, label, data){
  requestCount = requestCount+1
  if(requestCount >= 20){
    chart.data.labels.shift();
    chart.data.labels.push(label);
    chart.data.datasets[0].data.shift()
    chart.data.datasets[0].data.push(data)
    chart.update();
  }else{
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data)
    chart.update();
  }
}
function addData(chart, label, data,data2) {
  dataIs = dataIs+1;
  if(dataIs >= 20){
    chart.data.labels.shift();
    chart.data.labels.push(label);
    chart.data.datasets[0].data.shift()
    chart.data.datasets[1].data.shift()
    chart.data.datasets[0].data.push(data)
    chart.data.datasets[1].data.push(data2)
    chart.update();
  }else{
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data)
    chart.data.datasets[1].data.push(data2)
    chart.update();
  }
  
}
}())
