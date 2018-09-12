<?php
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$user = 'testuser';
	$pass = 'password123';
	$database = 'GSUParkingDatabase';
	$conn = new mysqli($servername, $user, $pass, $database);
    $username = $_POST['username'];
    $ipass = $_POST['password'];
    $newpassword = $_POST['newpassword'];
    $passwordhash = password_hash( $_POST['password'], PASSWORD_BCRYPT);
    if(!$conn)
	{
		echo("could not connect to database");
	}
	else
	{
        try{
            if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?")){
                $sql->bind_param("s", $username);
                $sql->execute();
                $sql->bind_result($user, $pass);
                $sql->fetch();
                    if(password_verify($ipass, $pass)
                    {
                        if($sql = $conn->prepare("UPDATE USER SET Password=? WHERE Username=?"){
                            $sql->bind_param("ss", $newpasswordhash, $username);
                            $sql->execute();
                        }
                    }
                    else
                    {
                     echo("denied");
                    }
            }
        }
        catch(Exception $e){
            echo("denied");
        }
	}
?>
