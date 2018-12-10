
document.addEventListener('readystatechange', event => {
  if (event.target.readyState === "interactive") {
  	makeRequest(verifyUser, "session.php", null);
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
	data.append("admin", "false");
	data.append("username", "user");
	makeAdminRequest(null, "session.php", data);
	window.location.href = "index.html";
}


function verifyUser()
{
	if(request.readyState == 4 && request.status == 200)
	{
		var res = JSON.parse(request.response);
		if(res.admin == "false")
		{
			var userP = document.getElementById("usernameP");
			var user = res.username;
			var link = document.getElementById("logoutLink");
			userP.innerHTML = "logged in as " + user+" | ";
			userP.appendChild(link);

		}
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
