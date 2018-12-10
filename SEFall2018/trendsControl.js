var requestURL = "request.php";
var loginURL = "adminLogin.php";
var sessionURL = "session.php";
var changeURL = "changeData.php";

var daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

var barColor = '#044228';
var barColor = 'rgba(4, 68, 40, .5)'
var bdrColor = '#000000';

function start()
{
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "CampusesHTML");
	makeRequest(setSelector, "data.php", data);
}
function setSelector()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var trendsCamp = document.getElementById("trendsCampSelector");
		trendsCamp.innerHTML = request.response;
	}
}
//Used for trends.html
function trendsSelectRequest(){
	var selector = document.getElementById("trendsCampSelector");
	var campusID = selector.options[selector.selectedIndex].value;
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "TrendsHTML");
	data.append("CampID", campusID);
	makeRequest(trendsSelectResponse, "data.php", data);

}
//Used for loadTrends.html
function trendsSelectRequest1(){
var selector = document.getElementById("trendsCampSelector");
	var campusID = selector.options[selector.selectedIndex].value;
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "TrendsHTML");
	data.append("CampID", campusID);
	makeRequest(trendsSelectResponse1, "data.php", data);
}
//Array to hold all of the lot names
var lotTitles=[];

//Used to store the amount of lots
var rows;

var count = 0;
//Used for the trends html page (users)
//Allow the user to select Monday-Friday in selector
function trendsSelectResponse(){
	if(request.readyState == 4 && request.status == 200)
	{
	var res = JSON.parse(request.response);
	
	var rowCount = parseInt(res["RowCount"]);

	rows = rowCount;

	//Removes all of the rows and data cells within the table before adding new data
	$("#trendsTable tr").remove(); 
	$("#trendsTable td").remove();
 
	//Getting the lot titles from the response and storing them in the lotTitles array
	for(i = 0; i < rowCount;i++){
		lotTitles[i] = res[i]["LotName"];
	}
	var tableRef = document.getElementById('trendsTable');

		//Each container within the table will contain two rows for selector(newRow0) and graph(newRow1)
		var newRow0;
		var newRow1;

		for(var i = 0; i < rowCount ;i++){
			if(i%2==0){
				//Determines if the last row contains one or two columns
				if(((rowCount-1) % 2 == 0) && i == (rowCount-1)){
				newRow0 = tableRef.insertRow();
				
			newRow0.innerHTML = "<td><div class = 'col-sm-6'><select id='daySelector"+i+"' onclick='setID(this.id)' onchange = 'trendsParked()'></select>\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4 style = 'color:white;display:inline-block;'>Lot "+lotTitles[i]+"</h4>\
						</div></td>";
												
					     
			newRow1 = tableRef.insertRow();
			newRow1.innerHTML = "<td><div id = 'parkedDay"+i+"' class='chart'>\
								<div class='chartTitle'>\
									<p>Average Parked Per Day</p>\
								</div>\
								<canvas id='averageParkedDay"+i+"'></canvas>\
							</div></td>";

				}
				else{
			newRow0 = tableRef.insertRow();
			newRow0.innerHTML = "<td><div class = 'col-sm-6'><select id='daySelector"+i+"' onclick='setID(this.id)'  onchange = 'trendsParked()'></select>\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4 style = 'color:white;display:inline'>Lot "+lotTitles[i]+"</h4></div></td>\
					     <td><div class = 'col-sm-6'><select id='daySelector"+(i+1)+"' onclick='setID(this.id)'  onchange = 'trendsParked()'></select>\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4 style = 'color:white;display:inline;text-align:center;'>Lot "+lotTitles[i+1]+"</h4></div></td>";

			newRow1 = tableRef.insertRow();
			newRow1.innerHTML = "<td><div id = 'parkedDay"+i+"' class='chart'>\
								<div class='chartTitle'>\
									<p>Average Available Spots Per Day</p>\
								</div>\
								<canvas id='averageParkedDay"+i+"'></canvas>\
							</div></td><td><div id = 'parkedDay"+(i+1)+"' class='chart'>\
								<div class='chartTitle'>\
									<p>Average Available Spots Per Day</p>\
								</div>\
								<canvas id='averageParkedDay"+(i+1)+"'></canvas>\
							</div></td>";
					}

			} //End of mod conditional (i%2==0)
			else{


			}
			}//End of for loop
		for(t = 0; t < rowCount;t++){
		if(!document.getElementById("daySelector"+t).options.length){
		var anaDay = document.getElementById("daySelector"+t);
		
		//Setting id for each day
		var dayid = 2;

		var chooseDay = document.createElement("option");
		chooseDay.text = "Choose Day";
		anaDay.add(chooseDay);
		anaDay.options[0].disabled = true;
		
		for(o = 0; o < daysOfWeek.length;o++){
		var days = document.createElement("option");
		days.text = daysOfWeek[o];
		days.value = dayid;
		anaDay.add(days);
		dayid++;
		}//End of inner for loop
		}//End of conditional

			//Used to get current day and immediately display it within each selector. 
		//var currentDay = new Date();
		// anaDay.selectedIndex = currentDay.getDay();
		
	}
	
	}

}

//Used for the loadTrends html page (for non-users)
//Non-users are only allowed to look at the current day's trends data
function trendsSelectResponse1(){
	if(request.readyState == 4 && request.status == 200)
	{
	var res = JSON.parse(request.response);
	
	var rowCount = parseInt(res["RowCount"]);
	rows = rowCount;

	//Removes all of the rows and data cells within the table before adding new data
	$("#trendsTable tr").remove(); 
	$("#trendsTable td").remove();
 
	//Getting the lot titles from the response and storing them in the lotTitles array
	for(i = 0; i < rowCount;i++){
		lotTitles[i] = res[i]["LotName"];
	}
	var tableRef = document.getElementById('trendsTable');
	
		//Each container within the table will contain two rows for selector(newRow0) and graph(newRow1)
		var newRow0;
		var newRow1;
		for(var i = 0; i < rowCount ;i++){
			if(i%2==0){
					//Determines if the last row contains one or two columns
				if(((rowCount-1) % 2 == 0) && i == (rowCount-1)){
				newRow0 = tableRef.insertRow();
				
			newRow0.innerHTML = "<td><div class = 'col-sm-6'><select id='daySelector"+i+"' onclick='setID(this.id)' onchange = 'trendsParked()'></select>\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4 style = 'color:white;'>Lot "+lotTitles[i]+"</h4>\
						</div></td>";
												
					     
			newRow1 = tableRef.insertRow();
			newRow1.innerHTML = "<td><div id = 'parkedDay"+i+"' class='chart'>\
								<div class='chartTitle'>\
									<p>Average Parked Per Day</p>\
								</div>\
								<canvas id='averageParkedDay"+i+"'></canvas>\
							</div></td>";

				}
				else{
			newRow0 = tableRef.insertRow();
			newRow0.innerHTML = "<td><div class = 'col-sm-6'><select id='daySelector"+i+"' onclick='setID(this.id)'  onchange = 'trendsParked()'></select>\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4 style = 'color:white;'>Lot "+lotTitles[i]+"</h4></div></td>\
					     <td><div class = 'col-sm-6'><select id='daySelector"+(i+1)+"' onclick='setID(this.id)'  onchange = 'trendsParked()'></select>\
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4 style = 'color:white;text-align:center;'>Lot "+lotTitles[i+1]+"</h4></div></td>";

			newRow1 = tableRef.insertRow();
			newRow1.innerHTML = "<td><div id = 'parkedDay"+i+"' class='chart'>\
								<div class='chartTitle'>\
									<p>Average Available Spots Per Day</p>\
								</div>\
								<canvas id='averageParkedDay"+i+"'></canvas>\
							</div></td><td><div id = 'parkedDay"+(i+1)+"' class='chart'>\
								<div class='chartTitle'>\
									<p>Average Available Spots Per Day</p>\
								</div>\
								<canvas id='averageParkedDay"+(i+1)+"'></canvas>\
							</div></td>";
					}

			}
			else{


			}
			}
		for(t = 0; t < rowCount;t++){
		if(!document.getElementById("daySelector"+t).options.length){
		var anaDay = document.getElementById("daySelector"+t);
		
		//Setting id for each day
		var dayid = 1;

		var current = new Date();
		var chooseDay = document.createElement("option");

		chooseDay.text = "Choose Day";
		chooseDay.value = 0;
		anaDay.add(chooseDay);
		anaDay.options[0].disabled = true;

		var days = document.createElement("option");
		if(current.getDay()>5){
		days.text = daysOfWeek[4];
		}
		else{
		days.text = daysOfWeek[current.getDay()-1];
		}
		days.value = current.getDay()+1;
		anaDay.add(days);

		var currentDay = new Date();
		 anaDay.selectedIndex = 0;
	}
}
	
}

}

//Stores id of lot
var lotDayID;
//Gets the id of the selector on click to figure out which lot is selected.
function setID(id){

for(y = 0; y < rows;y++){
if(id == ("daySelector"+y)){
lotDayID = y;
}

}
}

var id;

TODO: Figure out a way to allow all of the lots to request graph data for the current day on load
function trendsAverageParked(){

for(g = 0; g < rows;g++){
var daySelector = document.getElementById("daySelector"+g);
	var lotid = g;
	id = g;
	var dayid = daySelector.options[daySelector.selectedIndex].value;
	
	data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "AverageDays");
	data.append("LotID", lotid);
	data.append("Day", dayid);
makeRequest(loadAverageTrendsGraph, "data.php", data);
  }
	
}
function trendsParked(){
var lotid = lotDayID;
var daySelector = document.getElementById("daySelector"+lotDayID);
var dayid = daySelector.options[daySelector.selectedIndex].value;
console.log(lotid);
	data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "AverageDays");
	data.append("LotID", lotid);

	data.append("Day", dayid);
console.log(dayid);

	makeRequest(loadAverageTrendsGraph, "data.php", data);
}
function loadAverageTrendsGraph(){

	if(request.readyState == 4 && request.status == 200)
	{
		var res = request.response;
		var data = JSON.parse(res);
		$('#averageParkedDay'+lotDayID).remove();
		$('#parkedDay'+lotDayID).append("<canvas id='averageParkedDay"+lotDayID+"'><canvas>");
		var ctx = document.getElementById("averageParkedDay" + lotDayID).getContext('2d');
		
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

function logoutUser(){
 	var data = new FormData();
	data.append("admin", "");
	data.append("username", "");
	makeRequest(null, sessionURL, data);
	window.location.href = "index.html";
}
function makeRequest(callback, url, data)
{
	try
	{
		request = new XMLHttpRequest();
		request.addEventListener("readystatechange", callback, false);
		request.open("POST", url, true);
		request.send(data);
	}
	catch(e)
	{
		alert(e);
	}
}

function verifyNotEmpty(elementArray)
{
	var pass = true;
	elementArray.forEach(function(item, index){
		var count = 0;
		if(item.value == "" || item.value == null)
		{
			pass = false;
			item.style.boxShadow = "0px 0px 5px red";
		}
	});

	return pass;
}

function fieldFocus(event)
{
	var target = event.target;
	target.style.boxShadow = "";
}

function home(event)
{
	if(event != null)
	{
		event.preventDefault();
		window.location.href = "index.html";
	}
	else
		window.location.href = "index.html";
}

addEventListener("load", start, false);