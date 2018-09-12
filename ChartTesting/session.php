<?php
	session_start();

	if(isset($_SESSION['admin']))
	{
		if(isset($_POST['admin']))
		{
			$_SESSION['admin'] = $_POST['admin'];
			echo($_SESSION['admin']);
		}
		else
		{
			echo($_SESSION['admin']);
		}
	}
	else
	{
		$_SESSION['admin'] = "false";
		echo("false");
	}
	
	
?>