var mysql = require("mysql");

//Set up the connection to the database
var con = mysql.createConnection({
	host: "testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com",
	user: "testuser",
	password: "password123",
	database: "GSUParkingDatabase"
});


var lora_packet = require('lora-packet');

process.stdin.setEncoding('utf8');

//Whenever we read something from standard input call this function
process.stdin.on('readable', () => {
	//Get the input string
	var chunk = process.stdin.read();
	if (chunk !== null && chunk.charAt(0) == '~') {
		//Decode and unencrypt the packet
		var hex = decodePacket(chunk.substring(1, chunk.length));
		//Convert the packet to a javascript object
		var pack = hex_to_js(hex);
		//Insert the packet into the database
		addDataPack(pack);
		process.stdout.write("Data Packet Uploaded\n");
	}
});

process.stdin.on('end', () => {
 	// process.stdout.write('end');
});

function decodePacket(packetString){
	//-----------------
	// packet decoding

	// decode a packet
	var packet = lora_packet.fromWire(new Buffer(packetString, 'base64'));

	// create AppSkey
	var AppSKey = new Buffer('25ECCC647CCB999F079181F2AE7E82CC', 'hex');

	// Nwkskey
	var NwkSKey = new Buffer('71304B550506AD2CD102BB125B09AB05', 'hex');


	var hex = lora_packet.decrypt(packet, AppSKey, NwkSKey).toString('hex');

	return hex;
}

function hex_to_js(hex){
	//grab the payload length
	var payload_len = parseInt("0x" + hex.substring(4,6));
	//create array to store the traffic event objects
	var eventarr = new Array();
	//create date object for event date objects
	var curDate = new Date();

	//loop through each traffic event in the packet
	var i;
	for(i = 6; i < payload_len*14; i+=14){
		//grab all of the data from this event and add to object
		var avgdist = parseInt("0x" + hex.substring(i, i+2));

		var enterHr = parseInt("0x" + hex.substring(i+2, i+4));

                var enterMin = parseInt("0x" + hex.substring(i+4, i+6));

                var enterSec = parseInt("0x" + hex.substring(i+6, i+8));

		var exHr = parseInt("0x" + hex.substring(i+8, i+10));

                var exMin = parseInt("0x" + hex.substring(i+10, i+12));

                var exSec = parseInt("0x" + hex.substring(i+12, i+14));

		var enterDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), enterHr, enterMin, enterSec, 0);
		var exitDate = new Date (curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), exHr, exMin, exSec, 0);

		var t_event = {
			Event_Start_Time: enterDate,
			Event_End_Time: exitDate,
			Avergage_Distance_From_Sensor: avgdist
		}
		//push the event object into the array
		eventarr.push(t_event);
	}
	//construct the datapack object for return
	var data_pack = {
		Events: eventarr,
		Node_ID: hex.substring(0,2),
		Lot_ID: hex.substring(2,4),
		Organization_ID: 1,
		Clock_Drift: 0,
		Battery_Level: 0,
		Time_Last_Check_In: ">implying we check in",
		Software_Version: "no u"
	}
	return data_pack;
}

//utility function to print datapack to std output
function printPack(dataPack){
	process.stdout.write("Node ID: "+dataPack.Node_ID +"\n" );
        process.stdout.write("Lot ID: " +dataPack.Lot_ID +"\n" );
        process.stdout.write("Org ID: "+dataPack.Organization_ID +"\n" );
        process.stdout.write("Clock Drift: "+ dataPack.Clock_Drift +"\n" );
        process.stdout.write("Last Checkin Time: " +dataPack.Time_Last_Check_In +"\n" );
        process.stdout.write("Software Ver: "+ dataPack.Software_Version +"\n" );
	process.stdout.write("eventslen: " + dataPack.Events.length + "\n");
	//print each event
	for(var i = 0; i < dataPack.Events.length; i++){
		var event = dataPack.Events[i];
		process.stdout.write("Event " + i + "\n");

		process.stdout.write("Start Time: " + event.Start_Time +"\n");
		process.stdout.write("End Time: " + event.End_Time +"\n");
		process.stdout.write("AVG Dist: " + event.Avg_Dist +"\n");
	}
	//addDataPack(dataPack);

}

//Inserts data packets and traffic events into the database
function addDataPack(DataPack){
	//Construct a query to insert a Data table entry
	datapackQuery = 'INSERT INTO Data(Node_ID, Lot_ID, Organization_ID, Clock_Drift, Battery_Level, Time_Last_Check_In, Software_Version) VALUES('
                //EVENT ID IS AUTO INCREMENTED.
                +DataPack.Node_ID
                +','
                +DataPack.Lot_ID
                +','
                +DataPack.Organization_ID
                +','
                +'NULL'
                +','
                +DataPack.Battery_Level
                +','
                +'NULL'
                +',\"'
                +DataPack.Software_Version
                +'\")';
	//console.log(querystring);
	con.query( datapackQuery , (err,rows) => {
		if(err){ throw err;
			//If there is an error, print out the query
			console.log(datapackQuery);}
		else{
		}
	});
	//Since the data pack id is auto incremented we don't know it
	//This query retrieves the data pack ID of the data pack we just entered
	newDataQuery = 'SELECT Data_Pack_ID FROM Data WHERE Data_Pack_ID=(SELECT MAX(Data_Pack_ID) FROM Data WHERE Node_ID='
		+DataPack.Node_ID
    		+' AND Lot_ID='
    		+DataPack.Lot_ID
    		+' AND Organization_ID='
    		+DataPack.Organization_ID
    		+')';
	con.query( newDataQuery , (err,rows) => {
		if(err){ throw err;
			console.log(newDataQuery);}
		else{
			//Now that we know the data pack ID, we can insert multiple traffic events
			var Pack_ID = rows[0].Data_Pack_ID;
			
			//For each traffic event, insert it into the database
			for(var i=0; i< DataPack.Events.length; i++){
				addTrafficEvent(i, DataPack.Events[i], DataPack, Pack_ID);
			}
		}
	});
}

//Inserts a given traffic event into the database
function addTrafficEvent(EventID, TrafficEvent, DataPack, Data_Pack_ID){
	//COnstructs the query to insert a traffic event into the database
	//var trafficQuery = 'INSERT INTO Traffic_Event VALUES('
  	+EventID
  	+','
  	+Data_Pack_ID
  	+','
  	+DataPack.Node_ID
  	+','
  	+DataPack.Lot_ID
  	+','
  	+DataPack.Organization_ID
  	+',\''
  	+TrafficEvent.Event_Start_Time.toISOString().slice(0, 19).replace('T', ' ')
  	+'\',\''
  	+TrafficEvent.Event_End_Time.toISOString().slice(0, 19).replace('T', ' ')
  	+'\','
  	+TrafficEvent.Avergage_Distance_From_Sensor
  	+')';
    	con.query( trafficQuery , (err,rows) => {
    	if(err) {throw err;
	    console.log(trafficQuery);}
      	else{
    	}});
}
