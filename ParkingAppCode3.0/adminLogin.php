<?php
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$user = 'testuser';
	$pass = 'password123';
	$database = 'testdatabase';

	$username = $_POST['username'];
	$password = $_POST['password'];

	$conn = new mysqli($servername, $user, $pass, $database);

	if(!$conn)
	{
		echo("could not connect to datebase");
	}
	else
	{
		//$sql = "INSERT INTO Users VALUES ('testname','".sha1("testpass")."')";
		$sql = "SELECT count(*) FROM UsersTest WHERE Username='".$username."' and Password='".sha1($password)."'";
		$rs = $conn->query($sql);
		if($rs)
		{
			$row = $rs->fetch_row();
			$count = $row[0];
			if($count > 0)
			{
				echo("success");
			}
			else
			{
				echo("denied");
			}
		}
		else
		{
			echo("query failed");
		}
		
	}
?>