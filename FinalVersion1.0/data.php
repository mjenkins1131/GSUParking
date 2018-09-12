<?php
	$servername = 'testinstance1.ccoejqdeod0j.us-east-1.rds.amazonaws.com';
	$user = 'testuser';
	$pass = 'password123';
	$database = 'GSUParkingDatabase';
	$port = '3306';

	$conn = new mysqli($servername, $user, $pass, $database, $port);

	if($conn)
	{
		if(isset($_POST["Type"]))
		{
			$type = $_POST["Type"];

			if($type == "Get")
			{
				if(isset($_POST["Target"]))
				{
					$target = $_POST["Target"];

					if($target == "LotsHTML")
					{
						if(isset($_POST["CampusID"]))
						{
							$id = $_POST["CampusID"];
							echoLotsHTML($conn, $id);
						}
					}
					else if($target == "CampusesHTML")
					{
						echoCampusesHTML($conn);
					}
					else if($target == "LotCount")
					{
						if(isset($_POST["LotID"]))
						{
							$lid = $_POST["LotID"];
							echoLotCount($conn, $lid);
						}
						else
							echo("missing POST data");
					}
					else if($target == "LotsOverview")
					{
						$campusID = $_POST["CampusID"];
						echoLotsOverview($conn, $campusID);
					}
				}
				else
					echo("missing GET target");
			}
			else if($type == "Update")
			{
				if(isset($_POST["Target"]))
				{
					$target = $_POST["Target"];

					if($target == "Lot" && isset($_POST["LotID"]))
					{
						$id = $_POST["LotID"];

						if(isset($_POST["Capacity"]))
						{
							$capacity = $_POST["Capacity"];
							if(changeLotCapacity($conn, $id, $capacity))
							{
								if(isset($_POST["AvailableSpots"]))
								{
									$ava = $_POST["AvailableSpots"];
									if(changeLotAvailability($conn, $id, $ava))
										echo("success");
								}
								else
									echo("success");
							}
						}
						else if(isset($_POST["AvailableSpots"]))
						{
							$ava = $_POST["AvailableSpots"];
							if(changeLotAvailability($conn, $id, $ava))
								echo("success");
						}
					}
				}
			}
			else if($type == "Create")
			{
				if(isset($_POST["Target"]))
				{
					$target = $_POST["Target"];

					if($target == "Lot")
					{
						$campus = $_POST["CampusID"];
						$capacity = $_POST["Capacity"];
						$name = $_POST["Name"];
						newLot($conn, $campus, $name, $capacity);
					}
				}
			}
		}
	}
	else echo("could not connect to database");

	function echoLotAverageIn($conn, $lotID)
	{
		$sql = "SELECT * FROM Stat WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);
		if($rs)
		{

		}
		else 
			echo("get entries from stat by lotid query failed");
	}
	function newLot($conn, $campusID, $lotname, $capacity)
	{
		if($sql = $conn->prepare("INSERT INTO Lot VALUES (?, ?, ?, ?, ?)"))
		{
			$sql->bind_param("iisii", $lotID, $campusID, $lotname, $capacity, $parked);

			$lotID = getLastLotID($conn) + 1;
			$parked = 0;

			if($sql->execute())
				echo("success");
		}
		else
			echo("could not prepare new lot sql");
		
	}
	function getLastLotID($conn)
	{
		$sql = "SELECT * FROM Lot ORDER BY Lot_ID DESC";
		$rs = $conn->query($sql);
		if($rs)
		{
			$row = $rs->fetch_assoc();
			return $row["Lot_ID"];
		}
		else
			echo("get last lot id query failed");
	}
	function changeLotCapacity($conn, $lotID, $capacity)
	{
		$sql = "UPDATE Lot SET Capacity = ".$capacity." WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);

		if($rs)
			return true;
		else
			echo("change lot capacity query failed");
	}
	function changeLotAvailability($conn, $lotID, $availability)
	{
		$sql = "SELECT * FROM Lot WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);
		if($rs)
		{
			$row = $rs->fetch_assoc();
			$parked = $row["Capacity"] - $availability;
			$sql = "UPDATE Lot SET Parked = ".$parked." WHERE Lot_ID = ".$lotID;
			$rs = $conn->query($sql);
			if($rs)
				return true;
			else
				echo("change lot parked query failed");
		}
		else
			echo("query for lot info to change lot availability failed");
	}
	function echoCampusesHTML($conn)
	{
		$sql = "SELECT * FROM Organizational_Unit ORDER BY Organization_ID ASC";
		$rs = $conn->query($sql);
		if($rs)
		{
			echo "<option value='0' selected disable selected hidden>Choose Campus</option>";
			while($row = $rs->fetch_assoc())
				echo "<option value='".$row["Organization_ID"]."'>".$row["Organization_Name"]."</option>";
		}
		else
			echo("get campuses query failed");
	}
	function echoLotsHTML($conn, $campusID)
	{
		$sql = "SELECT * FROM Lot WHERE Organization_ID = ".$campusID;
		$rs = $conn->query($sql);
		if($rs)
		{
			echo "<option value='0' selected disable selected hidden>Choose Lot</option>";
			while($row = $rs->fetch_assoc())
				echo "<option value='".$row["Lot_ID"]."'>".$row["Lot_Name"]."</option>";
		}
		else
			echo("get lots query failed");
	}
	
	function echoLotCount($conn, $lotID)
	{
		$sql = "SELECT * FROM Lot WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);
		if($rs)
		{
			$row = $rs->fetch_assoc();
			$ar = [];
			$ar["LotName"] = $row["Lot_Name"];
			$ar["Capacity"] = $row["Capacity"];
			$ar["Parked"] = $row["Parked"];
				
			echo json_encode($ar);	
		}
		else
			echo("lot count query failed");
	}

	function echoLotsOverview($conn, $campusID)
	{
		$sql = "SELECT * FROM Lot WHERE Organization_ID = ".$campusID;
		$rs = $conn->query($sql);
		if($rs)
		{
			$ar = [];
			while($row = $rs->fetch_assoc())
				array_push($ar, $row);
			echo(json_encode($ar));
		}
		else
			echo("lots overview query failed");
	}
?>
