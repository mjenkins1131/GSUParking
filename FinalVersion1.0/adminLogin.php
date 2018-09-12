<?php

	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$user = 'testuser';
	$pass = 'password123';
	$database = 'GSUParkingDatabase';

	$conn = new mysqli($servername, $user, $pass, $database);
	$username = $_POST['username'];
	$ipass = $_POST['password'];

	if(!$conn)
	{
		echo("could not connect to database");
	}
	else
	{
		//$sql = "INSERT INTO Users VALUES ('testname','".sha1("testpass")."')";
        try{
            if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?")){
                $sql->bind_param("s", $username);
                $sql->execute();
                $sql->bind_result($user, $pass);
                $sql->fetch();
                    if(password_verify($ipass, $pass))
                    {
                        $ar = array('username'=>$_POST['username'], 'admin'=>'true');
                        echo(json_encode($ar));
                    }
                    else
                    {
                        $ar = array('username'=>$_POST['username'], 'admin'=>'false');
                        echo(json_encode($ar));
                    }
            }
        }
        catch(Exception $e)
        {
            echo("denied");
        }
	}
?>