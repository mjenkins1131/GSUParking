
var selector;
var lotnumber;
var avaspots;

var request;

function start()
{
	selector = document.getElementById("lotselector");
	lotnumber = document.getElementById("lotnumber");
	avaspots = document.getElementById("avaspots");

}

function LotSelected(event)
{
	var lotselected = selector.options[selector.selectedIndex].value;
	lotnumber.innerHTML = "Lot "+lotselected;

	var data = new FormData();
	data.append("lotnumber", lotselected);

	try
	{
		request = new XMLHttpRequest();
		request.addEventListener("readystatechange", LAresponse, false);
		request.open("POST", "request.php", true);
		request.send(data);
	}
	catch(e)
	{
		alert(e);
	}
	
	document.getElementById("defaultlot").selected = true;
}

//LotAvailabilty response
function LAresponse()
{
	if(request.readyState == 4 && request.status == 200)
	{
		avaspots.innerHTML = request.response;
	}
}

//change available spots submit listener
function CASsubmit()
{
	var input = document.getElementById("casinput");

	var newLotNum = input.value;

	var data = new FormData();
	data.append("lotnumber", lotnumber);
	data.append("freespaces", newLotNum);

	try
	{
		request = new XMLHttpRequest();
		request.addEventListener("readystatechange", LAresponse, false);
		request.open("POST", "changeData.php", true);
		request.send(data);
	}
	catch(e)
	{
		alert(e);
	}
}


addEventListener("load", start, false);