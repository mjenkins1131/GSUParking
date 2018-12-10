var requestURL = "request.php";
var loginURL = "adminLogin.php";
var sessionURL = "session.php";
var changeURL = "changeData.php";

var barColor = '#044228';
var barColor = 'rgba(4, 68, 40, .5)'
var bdrColor = '#000000';

var graphrequest;
Chart.defaults.global.legend.display = false;

function loadCountData(campusID)
{
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "LotsOverview");
	data.append("CampusID", campusID); /////////////////fix this. must select campus somewheres...
	makeGraphRequest(loadCountGraphs, "data.php", data);
}

function loadCountGraphs()
{
	if(graphrequest.readyState == 4 && graphrequest.status == 200)
	{
		var data = JSON.parse(graphrequest.response);

		loadCountGraph(data);
		loadCapacityGraph(data);
	}
}
function analyticsDaySelect(){
var selector = document.getElementById("lotSelector");
var daySelector = document.getElementById("daySelect");
	var lotid = selector.options[selector.selectedIndex].value;
	var dayid = daySelector.options[daySelector.selectedIndex].value;
	data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "AverageDays");
	data.append("LotID", lotid);
	data.append("Day", dayid);
	makeGraphRequest(loadAverageDaysGraph, "data.php", data);

}
function lotSelectAverageIn()
{
	var selector = document.getElementById("lotSelectorAVGIN");
	var lotid = selector.options[selector.selectedIndex].value;
	data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "AverageIn");
	data.append("LotID", lotid);
	makeGraphRequest(loadAverageInGraph, "data.php", data);
}

function lotSelectAverageOut()
{
	var selector = document.getElementById("lotSelectorAVGOUT");
	var lotid = selector.options[selector.selectedIndex].value;
	data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "AverageOut");
	data.append("LotID", lotid);
	makeGraphRequest(loadAverageOutGraph, "data.php", data);
}
function lotSelectAverageParked()
{
	var selector = document.getElementById("lotSelectorAVGParked");
	var lotid = selector.options[selector.selectedIndex].value;
	data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "AverageParked");
	data.append("LotID", lotid);
	makeGraphRequest(loadAverageParkedGraph, "data.php", data);
}
function loadAverageDaysGraph(){

	if(graphrequest.readyState == 4 && graphrequest.status == 200)
	{
		var res = graphrequest.response;
		var data = JSON.parse(res);
		$('#averageParkedDay').remove();
		$('#parkedDay').append('<canvas id="averageParkedDay"><canvas>');
		
		var ctx = document.getElementById("averageParkedDay").getContext('2d');
		
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5"],
		        datasets: [{
		            data: [data["eight"], data["nine"], data["ten"], data["eleven"], data["twelve"], data["one"], data["two"], data["three"], data["four"]],
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
		            		labelString: 'Average Parked'
		            	},
		                ticks: {
		                    beginAtZero:true
		                }
		            }],
		            xAxes: [{
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'Hour'
		            	}
		            }]
		        },
		        legend: { display: false }
		    }
		});
	}
}

function loadAverageParkedGraph()
{
	if(graphrequest.readyState == 4 && graphrequest.status == 200)
	{
		var res = graphrequest.response;
		var data = JSON.parse(res);

		var ctx = document.getElementById("averageParkedChart").getContext('2d');
	
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5"],
		        datasets: [{
		            data: [data["eight"], data["nine"], data["ten"], data["eleven"], data["twelve"], data["one"], data["two"], data["three"], data["four"]],
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
		            		labelString: 'Average Parked'
		            	},
		                ticks: {
		                    beginAtZero:true
		                }
		            }],
		            xAxes: [{
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'Hour'
		            	}
		            }]
		        },
		        legend: { disploy: false }
		    }
		});
	}
}

function loadAverageInGraph()
{
	if(graphrequest.readyState == 4 && graphrequest.status == 200)
	{
		var res = graphrequest.response;
		var data = JSON.parse(res);
			var ctx = document.getElementById("averageInChart").getContext('2d');
	
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5"],
		        datasets: [{
		            data: [data["eight"], data["nine"], data["ten"], data["eleven"], data["twelve"], data["one"], data["two"], data["three"], data["four"]],
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
		            		labelString: 'Average Cars In'
		            	},
		                ticks: {
		                    beginAtZero:true
		                }
		            }],
		            xAxes: [{
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'Hour'
		            	}
		            }]
		        },
		        legend: { disploy: false }
		    }
		});
	}
}

function loadAverageOutGraph()
{
	if(graphrequest.readyState == 4 && graphrequest.status == 200)
	{
		var res = graphrequest.response;
		var data = JSON.parse(res);

		var ctx = document.getElementById("averageOutChart").getContext('2d');
	
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: ["8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5"],
		        datasets: [{
		            data: [data["eight"], data["nine"], data["ten"], data["eleven"], data["twelve"], data["one"], data["two"], data["three"], data["four"]],
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
		            		labelString: 'Average Cars Out'
		            	},
		                ticks: {
		                    beginAtZero:true
		                }
		            }],
		            xAxes: [{
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'Hour'
		            	}
		            }]
		        },
		        legend: { disploy: false }
		    }
		});
	}
}

function loadCountGraph(tableData)
{
	var ctx = document.getElementById("openSpotsChart").getContext('2d');
	var opens = [];
	var countLabels = [];
	for(var i = 0; i < tableData.length; i++)
	//	opens.push(tableData[i]["Capacity"] - tableData[i]["OpenSpots"]);
        opens.push(tableData[i]["OpenSpots"]);
	for(var i = 0; i < tableData.length; i++)
		countLabels.push(tableData[i]["LotNumber"]);
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: countLabels,
	        datasets: [{
	            data: opens,
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
	var capacityLabels = [];
	for(var i = 0; i < tableData.length; i++)
		opens.push(tableData[i]["Capacity"]);
	for(var i = 0; i < tableData.length; i++)
		capacityLabels.push(tableData[i]["LotNumber"]);
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: capacityLabels,
	        datasets: [{
	            label: 'Capacity',
	            data: opens,
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

function clearGraphs()
{
	var parkedcanvas = document.getElementById("openSpotsChart");
	var capcanvas = document.getElementById("capacityChart");
	var avgincanvas = document.getElementById("averageInChart");
	var avgoutcanvas = document.getElementById("averageOutChart");
	var avgparkedcanvas = document.getElementById("averageParkedChart");

	var charts = [parkedcanvas, capcanvas, avgincanvas, avgoutcanvas, avgparkedcanvas];

	charts.forEach(function(item, index){
		const context = item.getContext('2d');
		context.clearRect(0, 0, item.width, item.height);
	})
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

