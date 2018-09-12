<?php
	$lotSelected = $_POST['lotSelected'];
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$username = 'testuser';
	$password = 'password123';
	$database = 'testdatabase';
	$port = '3306';

	//$servername = 'localhost';
	//$username = 'ParkingAdmin';
	//$password = 'password123';
	//$database = 'ParkingTest';

	$conn = new mysqli($servername, $username, $password, $database);

	if (!$conn)
	{
		echo("could not connect to database");
	}
	else
	{
		$sql="SELECT * FROM ParkingTest WHERE LotNumber=".$lotSelected;
		$rs = $conn->query($sql);
		if($rs)
		{
			$row = $rs->fetch_assoc();
			$num = $row['LotNumber'];
			$cap = $row['Capacity'];
			$ava = $row['OpenSpots'];
			$ar = array("lotNumber"=>$num, "capacity"=>$cap, "openSpots"=>$ava);
			echo(json_encode($ar));
		}
		else
			echo("query failed");
				
	}
	$conn->close();
?>