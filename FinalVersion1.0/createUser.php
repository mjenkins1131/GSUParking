<?php
    $servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
    $user = 'testuser';
    $pass = 'password123';
    $database = 'GSUParkingDatabase';
    $conn = new mysqli($servername, $user, $pass, $database);
    $adminusername = $_POST['username'];
    $adminpassword = $_POST['password'];
    $newusername = $_POST['newusername'];
    $newpassword = $_POST['newpassword'];
    $passwordhash = password_hash($newpassword, PASSWORD_BCRYPT);
    
    if(!$conn)
    {
        echo("could not connect to database");
    }
    else
    {
        try{
            if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?"))
            {
                $sql->bind_param("s", $newuser);
                $sql->bind_result($replyuser, $replypassword);
                $sql->execute();
                $sql->fetch();
                if($replyuser == null)
                {
                    if($sql = $conn->prepare("SELECT * FROM User WHERE Username=?"))
                    {
                        $sql->bind_param("s", $adminusername);
                        $sql->bind_result($replyadminusername, $replyadminpassword);
                        $sql->execute();
                        $sql->fetch();
                        if(password_verify($adminpassword, $replyadminpassword))
                        {
                            if($sql = $conn->prepare("INSERT INTO User VALUES(?,?)"))
                            {
                                $sql->bind_param("ss", $newusername, $passwordhash);
                                $sql->execute();
                                echo("Success");
                            }
                            else
                            {
                                echo("Error at admin creation!");
                            }
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
?>