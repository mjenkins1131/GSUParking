<?php
	session_start();

	if(isset($_POST['admin']))
		$_SESSION['admin'] = $_POST['admin'];

	if(!isset($_SESSION['admin']))
		$_SESSION['admin'] = 'false';

	echo($_SESSION['admin']);
	
?>