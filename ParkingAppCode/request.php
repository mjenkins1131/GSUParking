<?php
	$lotnumber = $_POST['lotnumber'];
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$username = 'testuser';
	$password = 'password123';
	$database = 'testdatabase';
	$port = '3306';

	$conn = new mysqli($servername, $username, $password, $database, $port);

	if (!$conn)
	{
		echo("could not connect to database");
	}
	else
	{
		$sql="SELECT * FROM ParkingTest WHERE LotNumber=".$lotnumber;
		$rs = $conn->query($sql);
		$row = $rs->fetch_assoc();
		echo($row['FreeSpaces']);		
	}
	$conn->close();
?>