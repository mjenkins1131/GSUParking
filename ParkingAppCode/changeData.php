<?php
	$lotnumber = $_POST['lotnumber'];
	$freespaces = (Integer)$_POST['freespaces'];

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
		$sql="UPDATE ParkingTest SET FreeSpaces=".$freespaces." WHERE LotNumber=".$lotnumber;
		$rs = $conn->query($sql);

		if($rs)
		{
			$sql2="SELECT * FROM ParkingTest WHERE LotNumber=".$lotnumber;
			$rs2 = $conn->query($sql2);
			$row = $rs2->fetch_assoc();
			echo($row['FreeSpaces']);
		}
		else
			echo("update failed");
				
	}
	$conn->close();
?>