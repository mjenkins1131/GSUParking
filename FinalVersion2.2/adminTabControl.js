var edit;
var analytics;
var create;
var options;
var divArray;

var editButton;
var analyticsButton;
var createButton;
var optionsButton;
var tabArray;

var changePassDiv;
var addAdminDiv;

var changePassExpand;
var addAdminExpand;

var openColor = "#E4E4E4";
var closedColor = "inherit";

var datarequest;

function start()
{
	edit = document.getElementById("editDiv");
	analytics = document.getElementById("analyticsDiv");
	create = document.getElementById("createLotDiv");
	options = document.getElementById("userOptionsDiv");

	editButton = document.getElementById("editTabBtn");
	analyticsButton = document.getElementById("analyticsTabBtn");
	createButton = document.getElementById("createLotBtn");
	optionsButton = document.getElementById("userTabBtn");

	changePassDiv = document.getElementById("changePassDiv");
	addAdminDiv = document.getElementById("addAdminDiv");

	divArray = [analytics, edit, create, options];
	tabArray = [analyticsButton, editButton, createButton, optionsButton];

	divArray.forEach(function(item, index){
		item.style.display = "none"
	});

	analytics.style.display = "block";
	//analyticsButton.style.backgroundColor = openColor;

	changePassDiv.style.visibility = "hidden";
	addAdminDiv.style.visibility = "hidden";

	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "CampusesHTML");
	makeDataRequest(setCampSelectors, "data.php", data);
}

function analyticsCampSelectRequest()
{
	clearGraphs();
	var selector = document.getElementById("analyticsCampSelect");
	var campid = selector.options[selector.selectedIndex].value;
	loadCountData(campid);
	var data = new FormData();
	data.append("Type", "Get");
	data.append("Target", "LotsHTML");
	data.append("CampusID", campid);
	makeDataRequest(setAnalyticsLotSelectors, "data.php", data);
}

function setAnalyticsLotSelectors()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = datarequest.response;

		var avginselector = document.getElementById("lotSelectorAVGIN");
		var avgoutselector = document.getElementById("lotSelectorAVGOUT");
		var avgparkedselector = document.getElementById("lotSelectorAVGParked");

		avginselector.innerHTML = res;
		avgoutselector.innerHTML = res;
		avgparkedselector.innerHTML = res;
	}
}

function changePasswordRequest()
{
	var passin = document.getElementById("currentPass");
	var newpassin = document.getElementById("newPass");
	var newpassin2 = document.getElementById("newPass2");
	elements = [passin, newpassin, newpassin2];
	if(verifyNotEmpty(elements))
	{
		var newpass = newpassin.value;
		var newpass2 = newpassin2.value;
		if(newpass == newpass2)
			makeDataRequest(changePasswordSubResponse, "session.php", null);
		else
			alert("passwords dont match");
	}
}
function changePasswordSubResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = JSON.parse(datarequest.response);
		var passin = document.getElementById("currentPass");
		var newpassin = document.getElementById("newPass");
		var newpassin2 = document.getElementById("newPass2");

		var username = res.username;
		var password = passin.value;
		var newpass = newpassin.value;

		var data = new FormData();
		data.append("Type", "ChangePassword");
		data.append("Username", username);
		data.append("Password", password);
		data.append("NewPassword", newpass);
		makeDataRequest(changePasswordResponse, "users.php", data);
	}
}
function changePasswordResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = datarequest.response;
		if(res == "Success")
		{
			alert("password changed");
			clearInput();
		}
		else
			alert(res);
	}
}
function newUserRequest()
{
	var passIn = document.getElementById("AAPassword");
	var newUserIn = document.getElementById("newAdminUsername");
	var newPassIn = document.getElementById("AAnewPass");
	var newPassIn2 = document.getElementById("AAnewPass2");
	elements = [passIn, newUserIn, newPassIn, newPassIn2];
	if(verifyNotEmpty(elements))
	{
		var newpass = newPassIn.value;
		var newpass2 = newPassIn2.value;
		if(newpass == newpass2)
			makeDataRequest(newUserSubResponse, "session.php", null);
		else
			alert("passwords did not match");		
	}
}
function newUserSubResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = JSON.parse(datarequest.response);
		var passIn = document.getElementById("AAPassword");
		var newUserIn = document.getElementById("newAdminUsername");
		var newPassIn = document.getElementById("AAnewPass");
		var newPassIn2 = document.getElementById("AAnewPass2");

		var username = res.username;
		var password = passIn.value;
		var newuser = newUserIn.value;
		var newpass = newPassIn.value;

		var data = new FormData();
		data.append("Type", "NewUser");
		data.append("Username", username);
		data.append("Password", password);
		data.append("NewUsername", newuser);
		data.append("NewPassword", newpass);
		makeDataRequest(newUserResponse, "users.php", data);
	}
}
function newUserResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = datarequest.response;
		if(res == "Success")
		{
			alert("new user added");
			clearInput();
		}
		else
			alert(res);
	}
}
function newLotRequest()
{
	var newCap = document.getElementById("newLotCapacity");
	var newName = document.getElementById("newLotName");
	elements = [newCap, newName];
	var selector = document.getElementById("campSelector2");

	if(selector.selectedIndex != 0)
	{
		var campID = selector.options[selector.selectedIndex].value;
		if(verifyNotEmpty(elements))
		{
			var name = newName.value;
			var cap = newCap.value;
			var data = new FormData();
			data.append("Type", "Create");
			data.append("Target", "Lot");
			data.append("CampusID", campID);
			data.append("Name", name);
			data.append("Capacity", cap);
			makeDataRequest(newLotResponse, "data.php", data);
		}
	}
	else
		alert("must choose campus");
}
function newLotResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = datarequest.response;
		if(res == "success")
		{
			alert("new table added");
			clearInput();
		}
		else
			alert(res);
	}
}

function updateLotRequest()
{
	var lotselector = document.getElementById("lotSelector");
	var campselector = document.getElementById("campSelector");
	if(campselector.selectedIndex != 0)
	{
		if(lotselector.selectedIndex != 0)
		{
			var avaInput = document.getElementById("changeAvailabilityInput");
			var capacityInput = document.getElementById("changeCapacityInput");

			if(avaInput.value == "" && capacityInput.value == "")
				alert("no values input");
			else
			{
				lotID = lotselector.options[lotselector.selectedIndex].value;
			
				var data = new FormData();
				data.append("Type", "Update");
				data.append("Target", "Lot");
				data.append("LotID", lotID);
				if(avaInput.value != "" && avaInput.value != null)
					data.append("AvailableSpots", avaInput.value);
				if(capacityInput.value != "" && capacityInput.value != null)
					data.append("Capacity", capacityInput.value);

				makeDataRequest(updateLotResponse, "data.php", data);
			}
		}
		else
			alert("must choose a lot");
	}
	else
		alert("must choose a campus");
	

}
function updateLotResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = datarequest.response;
		if(res == "success")
		{
			alert("Changes Were Successfully Made");
			var selector = document.getElementById("analyticsCampSelect");
			var campid = selector.options[selector.selectedIndex].value;
			loadCountData(campid);
			clearInput();
		}
		else
			alert(res);
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
	makeDataRequest(campusSelectResponse, "data.php", data);
}
function campusSelectResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var lotselector = document.getElementById("lotSelector");
		lotselector.innerHTML = datarequest.response;
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
	makeDataRequest(lotSelectResponse, "data.php", data);
}
function lotSelectResponse()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = JSON.parse(datarequest.response);
		var lotSelectedText = document.getElementById("lotSelectedText");
		var capacityText = document.getElementById("capacityText");
		var openSpotsText = document.getElementById("openSpotsText");

		lotSelectedText.innerHTML = res["LotName"];
		capacityText.innerHTML = res["Capacity"];
		openSpotsText.innerHTML = res["Capacity"] - res["Parked"];
	}
}
function setCampSelectors()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var campSelector = document.getElementById("campSelector");
		var campSelector2 = document.getElementById("campSelector2");
		var analyticsCampSelect = document.getElementById("analyticsCampSelect");

		campSelector.innerHTML = datarequest.response;
		campSelector2.innerHTML = datarequest.response;
		analyticsCampSelect.innerHTML = datarequest.response;
	}
}

function logoutRequest()
{
	var data = new FormData();
	data.append("admin", "false");
	data.append("username", "user");
	makeDataRequest(showAdmin, sessionURL, data);
}

function showAdmin()
{
	if(datarequest.readyState == 4 && datarequest.status == 200)
	{
		var res = JSON.parse(datarequest.response);
		if(res.admin == "true")
			window.location.href = "adminParking.html";
		else
			window.location.href = "index.html";
	}
}

function tabSwitch(event)
{
	var target = event.target;
	clearInput();
	tabArray.forEach(function(item, index){
		if(target == item)
		{
			//item.style.backgroundColor = openColor;
			divArray[index].style.display = "block";
		}
		else
		{
			//item.style.backgroundColor = closedColor;
			divArray[index].style.display = "none"
		}
	})
}

function clearInput()
{
	var e1 = document.getElementById("currentPass");
	var e2 = document.getElementById("newPass");
	var e3 = document.getElementById("newPass2");
	var e4 = document.getElementById("AAPasword");
	var e4 = document.getElementById("newAdminUsername");
	var e5 = document.getElementById("AAnewPass");
	var e6 = document.getElementById("AAnewPass2");
	var e7 = document.getElementById("newLotName");
	var e8 = document.getElementById("newLotCapacity");
	var e9 = document.getElementById("changeAvailabilityInput");
	var e10 = document.getElementById("changeCapacityInput");

	e1.value = "";
	e2.value = "";
	e3.value = "";
	e4.value = "";
	e5.value = "";
	e6.value = "";
	e7.value = "";
	e8.value = "";
	e9.value = "";
	e10.value = "";
}
function expandRequest(event)
{
	var target = event.target;
	if(target.id == "changePassExpand")
		expand(changePassDiv);
	else if(target.id == "addAdminExpand")
		expand(addAdminDiv);
}

function expand(element)
{
	var style = window.getComputedStyle(element);
	if(style.visibility == "hidden")
		element.style.visibility = "visible";
	else
		element.style.visibility = "hidden";
}

function makeDataRequest(callback, url, data)
{
	try
	{
		datarequest = new XMLHttpRequest();
		datarequest.addEventListener("readystatechange", callback, false);
		datarequest.open("POST", url, true);
		datarequest.send(data);
	}
	catch(e)
	{
		print(e);
	}
}

function fieldFocus(event)
{
	var target = event.target;
	target.style.boxShadow = "";
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
addEventListener("load", start, false);
