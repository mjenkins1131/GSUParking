
var selector;
var lotnumbertext;
var avaspotstext;
var changeinput;
var submitlotchange;

var lotselected;

var request;

function start()
{
	selector = document.getElementById("lotselector");
	lotnumbertext = document.getElementById("lotnumber");
	avaspots = document.getElementById("avaspots");
	changeinput = document.getElementById("casinput");
	submitlotchange = document.getElementById("submitlotchange");
	submitlotchange.addEventListener("click", CASsubmit, false);
}

function LotSelected(event)
{
	lotselected = selector.options[selector.selectedIndex].value;
	lotnumbertext.innerHTML = "Lot "+lotselected;

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
function CASsubmit(event)
{
	event.preventDefault();
	var newValue = changeinput.value;
	var data = new FormData();
	data.append("lotnumber", lotselected);
	data.append("freespaces", newValue);

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