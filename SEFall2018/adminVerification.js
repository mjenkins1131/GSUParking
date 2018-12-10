var adminRequest;

///TODO: create add user function for superuses
///set timer to check for inactivity and log out admins
///sanitize inputs
var alertTimer;
var logoutTimer;

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === "interactive") {
  	makeAdminRequest(verify, "session.php", null);
  }
});

function start()
{
	setTimers();
	//idleTimer();
	
}

function setTimers()
{
	clearTimeout(alertTimer);
	clearTimeout(logoutTimer);
	alertTimer = setTimeout(function(){alert("inactivity logout in 60 seconds")}, 840000);
	logoutTimer = setTimeout(logout, 900000);
}

function logout()
{
	var data = new FormData()
	data.append("admin", "");
	data.append("username", "");
	makeAdminRequest(null, "session.php", data);
	window.location.href = "index.html";
}

function verify()
{
	if(adminRequest.readyState == 4 && adminRequest.status == 200)
	{
		var res = JSON.parse(adminRequest.response);

		if(res.admin == "false")
			window.location.href = "userParking.html";
		else if(res.admin == "true")
		{
		
		}
		else{
			window.location.href = "index.html";
		}
	}
}

function makeAdminRequest(callback, url, data)
{
	try
	{
		adminRequest = new XMLHttpRequest();
		adminRequest.addEventListener("readystatechange", callback, false);
		adminRequest.open("POST", url, true);
		adminRequest.send(data);
	}
	catch(e)
	{
		alert(e);
	}
}

addEventListener("load", start, false);
addEventListener("mousemove", setTimers, false);
