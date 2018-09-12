<?php
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$username = 'testuser';
	$password = 'password123';
	$database = 'testdatabase';
	$port = '3306';

	$lotSelected = $_POST['lotSelected'];
	$newAvailability = $_POST['newAvailability'];
	$newCapacity = $_POST['newCapacity'];

	$conn = new mysqli($servername, $username, $password, $database, $port);

	if (!$conn)
	{
		echo("could not connect to database");
	}
	else
	{
		if(isset($newAvailability))
		{
			$sql="UPDATE ParkingTest SET OpenSpots=".$newAvailability." WHERE LotNumber=".$lotSelected;
			$rs = $conn->query($sql);
		}
		if(isset($newCapacity))
		{
			$sql = "UPDATE ParkingTest SET Capacity=".$newCapacity." WHERE LotNumber =".$lotSelected;
			$rs = $conn->query($sql);
		}			
	}
	$conn->close();
?>