var requestURL = "request.php";
var loginURL = "adminLogin.php";
var sessionURL = "session.php";
var changeURL = "changeData.php";

var prop;
var map;
var daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
function start()
{
	prop = { center:new google.maps.LatLng(32.42054890000001,-81.7865347),zoom:15,};
	map = new google.maps.Map(document.getElementById("map"), prop );
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "CampusesHTML");
	makeRequest(setCampusSelector,"data.php", data);
	
}
function setCampusSelector()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var campselector = document.getElementById("campSelector");
		campselector.innerHTML = request.response;
		 
	}
}
function campusSelectRequest()
{
	var selector = document.getElementById("campSelector");
	var campusID = selector.options[selector.selectedIndex].value;
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "LotsHTML");
	data.append("CampusID", campusID);
	makeRequest(campusSelectResponse, "data.php", data);
}
function campusSelectResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var lotselector = document.getElementById("lotSelector");
		lotselector.innerHTML = request.response;
		

	}
}
function analyticsCampusSelectRequest(){
	var selector = document.getElementById("analyticsCampSelect");
	var campusID = selector.options[selector.selectedIndex].value;
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "LotsHTML");
	data.append("CampusID", campusID);
	makeRequest(analyticsCampSelectResponse, "data.php", data);

}
function analyticsCampusSelectResponse(){
if(request.readyState == 4 && request.status == 200)
	{
		var lotselector = document.getElementById("lotSelect");
		lotselector.innerHTML = request.response;
		
	}


}
function lotSelectRequest()
{
	var selector = document.getElementById("lotSelector");
	var lotID = selector.options[selector.selectedIndex].value;
	
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "LotCount");
	data.append("LotID", lotID);
	makeRequest(lotSelectResponse, "data.php", data);
}
function lotSelectResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var res = JSON.parse(request.response);
		var lotSelectedText = document.getElementById("lotSelectedText");
		var capacityText = document.getElementById("capacityText");
		var openSpotsText = document.getElementById("openSpotsText");
		 
		
		lotSelectedText.innerHTML = res["LotName"];
		capacityText.innerHTML = res["Capacity"];
		var open = parseInt(res["OpenSpots"]);
		var capacity = parseInt(res["Capacity"]);
		if(open < 0){
		openSpotsText.innerHTML = 0;
		}
		else if(open > capacity){
			openSpotsText.innerHTML = res["Capacity"];
					}
		else{
			openSpotsText.innerHTML = res["OpenSpots"];
		}
		var latlng = new google.maps.LatLng(res["Lat"],res["Lng"]);
		map.panTo(latlng);
		map.setZoom(17);
		map.setMapTypeId('hybrid');

		//Average Day Lot selector dependent on parking count selector on userParking page
		var lotSelect = document.getElementById("lotSelected");
		lotSelect.innerHTML = res["LotName"];

		if(!document.getElementById("daySelect").options.length){
		var anaDay = document.getElementById("daySelect"); 
		var currentday = new Date();
		var dayid = currentday.getDay()+1;
		var days = document.createElement("option");
		days.text = daysOfWeek[currentday.getDay()-1];
		days.value = dayid;
		anaDay.add(days);
		}
		analyticsDaySelect();
		
		}
}
function loginRequest(event)
{
	event.preventDefault();
	var username = document.getElementById("usernameInput");
	var password = document.getElementById("passwordInput");
	var elements = [username, password];
	if(verifyNotEmpty(elements))
	{
		var data = new FormData();
		data.append("Type", "Login");
		data.append("Username", elements[0].value);
		data.append("Password", elements[1].value);
		makeRequest(loginResponse, "users.php", data);
	}
}

function loginResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var res = JSON.parse(request.response);
		if(res.admin == "true")
		{
			var data = new FormData();
			data.append("username", res.username);
			data.append("admin", "true");
			makeRequest(showAdmin, sessionURL, data);
		}
		else if(res.admin == "false"){
		var data = new FormData();
			data.append("username", res.username);
			data.append("admin", "false");
			makeRequest(showAdmin, sessionURL, data);

		}
		else 
			alert("Wrong Username or Password");
	}
}

function userRequest(){
	makeRequest(setFavRequest,"session.php",null);
}


/*Favorites*/
//TODO: Get the favorited lot to display on login
function getRequest(){
makeRequest(getFavRequest,"session.php",null);
}

function setFavRequest(){
if(request.readyState == 4 && request.status == 200){
var res = JSON.parse(request.response);

var selector = document.getElementById("lotSelector");
var user = res.username;

var lotID = selector.options[selector.selectedIndex].value;

var data = new FormData();
data.append("Type","SetFav");
data.append("User",user);

if($('#star').hasClass('fa-star-o')){
lotID = 'null';
data.append("Lot",lotID);
}
else{
data.append("Lot",lotID);
}

makeRequest(favResponse,"users.php",data);
}
}

function favResponse(){
if(request.readyState == 4 && request.status == 200){
	
}
}
function showAdmin()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var res = JSON.parse(request.response);
		if(res.admin == "true")
			window.location.href = "adminParking.html";
		else if(res.admin == "false")
			window.location.href = "userParking.html";
		else
			window.location.href = "index.html";
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