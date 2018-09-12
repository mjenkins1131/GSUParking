<?php
	session_start();

	if(isset($_POST['campus']))
		$_SESSION['campus'] = $_POST['campus'];
	else if(!isset($_SESSION['campus']))
		$_SESSION['campus'] = 'main';

	if(isset($_POST['username']))
		$_SESSION['username'] = $_POST['username'];
	else if(!isser($_SESSION['username']))
		$_SESSION['username'] = 'username';

	if(isset($_POST['admin']))
		$_SESSION['admin'] = $_POST['admin'];

	if(!isset($_SESSION['admin']))
		$_SESSION['admin'] = 'false';

	$ar = array("admin"=>$_SESSION['admin'], "username"=>$_SESSION['username'], "page"=>$_SESSION['campus']);
	echo(json_encode($ar));

?>
