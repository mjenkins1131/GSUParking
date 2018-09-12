<?php
	
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$user = 'testuser';
	$pass = 'password123';
	$database = 'GSUParkingDatabase';
	$port = 3306;

	$conn = new mysqli($servername, $user, $pass, $database, $port);

	if($conn)
	{
		if(isset($_POST["Type"]))
		{
			$type = $_POST["Type"];

			if($type == "Login")
			{
				$username = $_POST["Username"];
				$password = $_POST["Password"];
				login($conn, $username, $password);
			}
			else if($type == "ChangePassword")
			{
				$username = $_POST["Username"];
				$password = $_POST["Password"];
				$newpass = $_POST["NewPassword"];
				changePassword($conn, $username, $password, $newpass);
			}
			else if($type == "NewUser")
			{
				$username = $_POST["Username"];
				$password = $_POST["Password"];
				$newuser = $_POST["NewUsername"];
				$newpass = $_POST["NewPassword"];
				addUser($conn, $username, $password, $newuser, $newpass);
			}

		}
		else
			echo("must provide 'Type' to POST");
	}
	else
		echo("could not connect to database");


	function changePassword($conn, $username, $password, $newpass)
	{
		try
		{
            if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?"))
            {
                $sql->bind_param("s", $username);
                $sql->execute();
                $sql->bind_result($replyuser, $replypass);
                $sql->fetch();
                if(password_verify($password, $replypass))
                {
                    updateUser($conn, $username, $newpass);
                }
                else
                {
                 	echo("denied");
                }
            }
        }
        catch(Exception $e)
        {
            echo("denied");
        }
	}
    function updateUser($conn, $username, $newpass)
    {
        $test = "UPDATE User SET Password = '".$newpass."' WHERE Username = '".$username."'";
        $rs = $conn->query($test);
        if($rs)
            echo("Success");
        else
            echo("Failed");
    }


	function addUser($conn, $username, $password, $newuser, $newpass)
	{
		try{
            if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?"))
            {
                $sql->bind_param("s", $newuser);
                $sql->bind_result($replyuser, $replypass);
                $sql->execute();
                $sql->fetch();
                if($replyuser == null)
                {
                    if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?"))
                    {
                        $sql->bind_param("s", $username);
                        $sql->bind_result($replyuser, $replypass);
                        $sql->execute();
                        $sql->fetch();
                        if(password_verify($password, $replypass))
                        {
                            $sql = $conn->prepare("INSERT INTO User VALUES (?, ?)");
                            
                        	$passwordhash = password_hash($newpass, PASSWORD_BCRYPT);
                            $sql->bind_param("ss", $newuser, $passwordhash);
                            $sql->execute();
                            echo("Success");
                        }
                        else
                        {
                            echo("Incorrect admin information!");
                        }
                    }
                }
                else{
                    echo("User already exists!");
                }
            }
        }
        catch(Exception $e){
            echo("denied");
        }
	}
	function login($conn, $username, $password)
	{
		try{
            if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?")){
                $sql->bind_param("s", $username);
                $sql->execute();
                $sql->bind_result($replyuser, $replypass);
                $sql->fetch();
                    if(password_verify($password, $replypass))
                    {
                        $ar = array('username'=>$username, 'admin'=>'true');
                        echo(json_encode($ar));
                    }
                    else
                    {
                        $ar = array('username'=>$username, 'admin'=>'false');
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