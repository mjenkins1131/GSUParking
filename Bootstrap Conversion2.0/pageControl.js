var requestURL = "request.php";
var loginURL = "adminLogin.php";
var sessionURL = "session.php";
var changeURL = "changeData.php";


function selectRequest()
{
	var selector = document.getElementById("lotSelector");
	var lotSelected = selector.options[selector.selectedIndex].value;
	var data = new FormData();
	data.append("lotSelected", lotSelected);
	makeRequest(selectResponse, requestURL, data);
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

function loginRequest(event)
{
	event.preventDefault();
	var username = document.getElementById("usernameInput");
	var password = document.getElementById("passwordInput");
	var elements = [username, password];
	if(verifyNotEmpty(elements))
	{
		var data = new FormData();
		data.append("username", elements[0].value);
		data.append("password", elements[1].value);
		makeRequest(loginResponse, loginURL, data);//change callback once php login script is made
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
		else if(res.admin == "false")
			alert("Wrong Username or Password");
	}
}

function logoutRequest()
{
	var data = new FormData();
	data.append("admin", "false");
	data.append("username", "user");
	makeRequest(showAdmin, sessionURL, data);
}

function changeRequest(event)
{
	event.preventDefault();
	var selector = document.getElementById("lotSelector");
	var avaInput = document.getElementById("changeAvailabilityInput");
	var capacityInput = document.getElementById("changeCapacityInput");
	var elements = [selector, avaInput, capacityInput];
	var lotSelected = selector.options[selector.selectedIndex].value;
	var data = new FormData();
	data.append("lotSelected", lotSelected);
	data.append("newCapacity", capacityInput.value);
	data.append("newAvailability", avaInput.value);
	makeRequest(changeResponse, changeURL, data);
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
		setTimeout(loadData, 500);
	}
}

function showAdmin()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var res = JSON.parse(request.response);
		if(res.admin == "true")
			window.location.href = "adminParking.html";
		else
			window.location.href = "index.html";
	}
	
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
