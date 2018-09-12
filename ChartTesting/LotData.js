//This is the main javascript file for the Parking Website
//The index.html file is the main html page this script is attached to.
//index.html contains only the header of the page(everything in the top section),
//as well as the div containers for the positioning, background, and display content.
//when a different 'page' is needed (such as the login page or admin page) the script
//loads the html from the corresponding html file and places it in the content container,
//instead of loading a different html file into the browser
//the html files that hold the content contain only the content to be added, and aren't
//meant to be displayed as the current html file.

//urls to files used
var userContentURL = "userParking.html";
var adminContentURL = "adminParking.html";
var loginContentURL = "login.html";
var requestURL = "request.php";
var changeURL = "changeData.php";
var loginURL = "adminLogin.php";
var sessionURL = "session.php";

var content; //main div where all the page content will be placed
var request; //the XMLHttpRequest object

//this is called once the index page is loaded
//initializes content and adds userParking to content
function start()
{
	content = document.getElementById("content");
	makeRequest(startResponse, sessionURL, null);
}

//this handles page reloads and the initial page loads
//checks loads either the admin or user page based on 
//session response
function startResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var admin = request.response;
		if(admin == "false")
		{
			var link = document.getElementById("loginLink");
			link.innerHTML = "Admin Login";
			makeRequest(setContent, userContentURL, null);
		}
		else if(admin == "true")
		{
			var link = document.getElementById("loginLink");
			link.innerHTML = "Logout";
			makeRequest(setContent, adminContentURL, null);
		}
	}
}

///////////// LOAD/SET CONTENT FUNCTIONS //////////////////
function handleLoginLink()
{
	var link = document.getElementById("loginLink");
	if(link.innerHTML == "Admin Login")
		makeRequest(setContent, loginContentURL, null);
	else if(link.innerHTML == "Logout")
	{
		var data = new FormData();
		data.append("admin", "false");
		makeRequest(startResponse, sessionURL, data);
	}
}

function loadUser(event)
{
	if(event != null)
		event.preventDefault();
	makeRequest(setContent, userContentURL, null);
}

//this sets the html in the content div. 
//response function for request. request returns html to set
function setContent()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var text = request.responseText;
		var escapeText = text.replace(/"/g, "\"");
		content.innerHTML = escapeText;
	}
}


///////////// REQUEST/RESPONSE FUNCTIONS //////////////

//generic request function, can pretty much do any XMLHttpRequest specified with parameters
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

function selectRequest()
{
	var selector = document.getElementById("lotSelector");
	if(selector == null)
		setTimeout(selectRequest, 500);
	else
	{
		var lotSelected = selector.options[selector.selectedIndex].value;
		var data = new FormData();
		data.append("lotSelected", lotSelected);
		makeRequest(selectResponse, requestURL, data);
	}
}
function selectResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var data = JSON.parse(request.response);
		var lotSelectedText = document.getElementById("lotSelectedText");
		var capacityText = document.getElementById("capacityText");
		var openSpotsText = document.getElementById("openSpotsText");

		lotSelectedText.innerHTML = data.lotNumber;
		capacityText.innerHTML = data.capacity;
		openSpotsText.innerHTML = data.openSpots;
	}
}

function changeRequest(event)
{
	event.preventDefault();
	var selector = document.getElementById("lotSelector");
	var avaInput = document.getElementById("changeAvailabilityInput");
	var capacityInput = document.getElementById("changeCapacityInput");
	var elements = [selector, avaInput, capacityInput];
	if(verifyNonNull(elements))
	{
		var lotSelected = selector.options[selector.selectedIndex].value;
		var data = new FormData();
		data.append("lotSelected", lotSelected);
		data.append("newCapacity", capacityInput.value);
		data.append("newAvailability", avaInput.value);
		makeRequest(changeResponse, changeURL, data);
	}
	else
		setTimeout(changeRequest, 500);
}
function changeResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var i1 = document.getElementById("changeCapacityInput");
		var i2 = document.getElementById("changeAvailabilityInput");
		i1.value = "";
		i2.value = "";
		selectRequest();
	}
}

function loginRequest(event)
{
	event.preventDefault();
	var username = document.getElementById("usernameInput");
	var password = document.getElementById("passwordInput");
	var elements = [username, password];
	if(verifyNonNull(elements))
	{
		if(verifyNotEmpty(elements))
		{
			var data = new FormData();
			data.append("username", elements[0].value);
			data.append("password", elements[1].value);
			makeRequest(loginResponse, loginURL, data);//change callback once php login script is made
		}
	}
	else
		setTimeout(loginRequest, 500);
	
}
function loginResponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var res = request.response;
		if(res == "success")
		{
			var data = new FormData();
			data.append("admin", "true");
			makeRequest(startResponse, sessionURL, data);
		}
		else if(res == "denied")
			alert("Wrong Username or Password");
	}
}


///////////// HELPER FUNCTIONS  ////////////////

//used if a submitted for is not allowed to have any empty fields, 
//place form elements to check in array and pass to function. returns bool	
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

//used to check for null elements from DOM tree not updated
//returns bool. 
function verifyNonNull(elementArray)
{
	var pass = true;
	elementArray.forEach(function(item, index){
		if(item == null)
			pass = false;
	});
	return pass;
}

//////////////// OTHER LISTENERS ///////////////

function fieldFocus(event)
{
	var target = event.target;
	target.style.boxShadow = "";
}

addEventListener("load", start, false);