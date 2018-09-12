var requestURL = "request.php";
var loginURL = "adminLogin.php";
var sessionURL = "session.php";
var changeURL = "changeData.php";

var barColor = '#044228';
var barColor = 'rgba(4, 68, 40, .5)'
var bdrColor = '#000000';

var graphrequest;
Chart.defaults.global.legend.display = false;

function loadData()
{
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "LotsOverview");
	data.append("CampusID", 1); /////////////////fix this. must select campus somewheres...
	makeGraphRequest(loadGraphs, "data.php", data);
}

function loadGraphs()
{
	if(graphrequest.readyState == 4 && graphrequest.status == 200)
	{
		var data = JSON.parse(graphrequest.response);

		loadCountGraph(data);
		loadCapacityGraph(data);
	}
}

function loadCountGraph(tableData)
{
	var ctx = document.getElementById("openSpotsChart").getContext('2d');
	var opens = [];
	for(var i = 0; i < tableData.length; i++)
		opens.push(tableData[i]["OpenSpots"]);

	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: ["11", "12", "13", "21", "30", "31", "32", "33", "41", "42"],
	        datasets: [{
	            data: [opens[0], opens[1], opens[2], opens[3], opens[4], opens[5], opens[6], opens[7], opens[8], opens[9]],
	            backgroundColor: barColor,
	            borderColor: bdrColor,
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	            	scaleLabel: {
	            		display: true,
	            		labelString: 'Open Spots'
	            	},
	                ticks: {
	                    beginAtZero:true
	                }
	            }],
	            xAxes: [{
	            	scaleLabel: {
	            		display: true,
	            		labelString: 'Lot Number'
	            	}
	            }]
	        },
	        legend: { disploy: false }
	    }
	});
}

function loadCapacityGraph(tableData)
{
	var ctx = document.getElementById("capacityChart").getContext('2d');
	var opens = [];
	for(var i = 0; i < tableData.length; i++)
		opens.push(tableData[i]["Capacity"]);

	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: ["11", "12", "13", "21", "30", "31", "32", "33", "41", "42"],
	        datasets: [{
	            label: 'Capacity',
	            data: [opens[0], opens[1], opens[2], opens[3], opens[4], opens[5], opens[6], opens[7], opens[8], opens[9]],
	            backgroundColor: barColor,
	            borderColor: bdrColor,
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	            	scaleLabel: {
	            		display: true,
	            		labelString: 'Capacity'
	            	},
	                ticks: {
	                    beginAtZero:true
	                }
	            }],
	            xAxes: [{
	            	scaleLabel: {
	            		display: true,
	            		labelString: 'Lot Number'
	            	}
	            }]
	        }
	    }
	});
}

function makeGraphRequest(callback, url, data)
{
	try
	{
		graphrequest = new XMLHttpRequest();
		graphrequest.addEventListener("readystatechange", callback, false);
		graphrequest.open("POST", url, true);
		graphrequest.send(data);
	}
	catch(e)
	{
		print(e);
	}
}



addEventListener("load", loadData, false);
