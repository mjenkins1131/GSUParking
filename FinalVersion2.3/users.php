<?php
	
	$servername = 'engproj.cacbqmwvl8xq.us-east-2.rds.amazonaws.com'; //server that is being connected to
	$user = 'testuser'; // user name of the mysql database
	$pass = 'ParkingDB123'; // password to the database
	$database = 'GSUParkingLot'; // database name that will be used
	$port = '3306';
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
            if($sql = $conn->prepare("SELECT * FROM Users WHERE Email_Address=?"))
            {
                $sql->bind_param("s", $username);
                $sql->execute();
                $sql->bind_result($userid, $replyuser, $replypass, $status);
                $sql->fetch();

                if(password_verify($password, $replypass))
				{
				
                    $sql->close();
                    if($sql = $conn->prepare("UPDATE Users SET Password = ? WHERE Email_Address = ?"))
                    {
                        $passwordhash = password_hash($newpass, PASSWORD_BCRYPT);
                        $sql->bind_param("ss", $passwordhash, $username);
                        $sql->execute();
                        echo("Success");
                    }
                    else
                        echo("the error::".$sql->error);
				}
				else
					echo("wrong password");
			}				
                else
					echo("denied");
				
        }
        catch(Exception $e)
        {
            echo("denied");
        }
	}

	function addUser($conn, $username, $password, $newuser, $newpass)
	{
		try
        {
            if($sql = $conn->prepare("SELECT * FROM Users WHERE Email_Address=?"))
            {
                $sql->bind_param("s", $newuser);
				$sql->execute();
                $sql->bind_result($UserId, $replyuser, $replypass, $status);
                $sql->fetch();
				
                if($replyuser == null)
                {
                    $sql->close();
					
                    if($sql = $conn->prepare("SELECT * FROM Users WHERE Email_Address=?"))
                    {
                        $sql->bind_param("s", $username);
						$sql->execute();
                        $sql->bind_result($UserId, $replyuser, $replypass, $status);
                        $sql->fetch();
						
                        if(password_verify($password, $replypass))
                        {
                            $sql->close();
                            $sql = $conn->prepare("INSERT INTO Users VALUES (?, ?, ?, ?)");
                        	$passwordhash = password_hash($newpass, PASSWORD_BCRYPT);
							$adminAuth = 1;
							$UserID = getLastUserID($conn) + 1;
                            $sql->bind_param("issi", $UserID, $newuser, $passwordhash, $adminAuth);
                            $sql->execute();
                            echo("Success");
                        }
                        else
                            echo("Incorrect admin information!");
                    }
					else
						echo("SQL connection 2 error");
                }
                else
                    echo("User already exists!");
            }
			else
				echo("SQL connection 1 error");
        }
        catch(Exception $e)
        {
            echo("denied");
        }
	}

	function login($conn, $username, $password)
	{
		try
        {
            if($sql = $conn->prepare("SELECT * FROM Users WHERE Email_Address=?")) //determine if is user
            {
                $sql->bind_param("s", $username);
                $sql->execute();
                $sql->bind_result($replyid, $replyuser, $replypass, $replyadmin);
                $sql->fetch();
		
		
		if(password_verify($password, $replypass))
		{
			$ar = array('username'=>$username,'admin'=>'true');
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
	
	function getLastUserID($conn)
	{
		$sql = "SELECT * FROM Users ORDER BY User_Id DESC";
		$rs = $conn->query($sql);
		if($rs)
		{
			$row = $rs->fetch_assoc();
			return $row["User_Id"];
		}
		else
			echo("get user lot id query failed");
	}
?>