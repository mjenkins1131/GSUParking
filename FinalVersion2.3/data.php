<?php
	$servername = 'engproj.cacbqmwvl8xq.us-east-2.rds.amazonaws.com';
	$user = 'testuser';
	$pass = 'ParkingDB123';
	$database = 'GSUParkingLot';
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
					else if($target == "AverageIn")
					{
						$lotID = $_POST["LotID"];
						echoLotAverageIn($conn, $lotID);
					}
					else if($target == "AverageOut")
					{
						$lotID = $_POST["LotID"];
						echoLotAverageOut($conn, $lotID);
					}
					else if($target == "AverageParked")
					{
						$lotID = $_POST["LotID"];
						echoLotAverageParked($conn, $lotID);
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


	function echoLotAverageParked($conn, $lotID)
	{
		$sql = "SELECT * FROM Stat WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);
		if($rs)
		{
			$eight = 0;
			$nine = 0;
			$ten = 0;
			$eleven = 0;
			$twelve = 0;
			$one = 0;
			$two = 0;
			$three = 0;
			$four = 0;

			$c8 = 0;
			$c9 = 0;
			$c10 = 0;
			$c11 = 0;
			$c12 = 0;
			$c1 = 0;
			$c2 = 0;
			$c3 = 0;
			$c4 = 0;

			while($row = $rs->fetch_assoc())
			{
				$date = strtotime($row["Date_Time"]);
				$parked = $row["Parked"];
				$day = date('D', $date);
				$hour = date('H', $date);

				if($day != 'Sat' && $day != 'Sun')
				{
					if($hour >= '08' && $hour < '17')
					{
						if($hour == '08')
						{
							$eight += $parked;
							$c8++;
						}
						else if($hour == '09')
						{
							$nine += $parked;
							$c9++;
						}
						else if($hour == '10')
						{
							$ten += $parked;
							$c10++;
						}
						else if($hour == '11')
						{
							$eleven += $parked;
							$c11++;
						}
						else if($hour == '12')
						{
							$twelve += $parked;
							$c12++;
						}
						else if($hour == '13')
						{
							$one += $parked;
							$c1++;
						}
						else if($hour == '14')
						{
							$two += $parked;
							$c2++;
						}
						else if($hour == '15')
						{
							$three += $parked;
							$c3++;
						}
						else if($hour == '16')
						{
							$four += $parked;
							$c4++;
						}
					}
				}
			}

			if($c8 == 0)
				$c8++;
			if($c9 == 0)
				$c9++;
			if($c10 == 0)
				$c10++;
			if($c11 == 0)
				$c11++;
			if($c12 == 0)
				$c12++;
			if($c1 == 0)
				$c1++;
			if($c2 == 0)
				$c2++;
			if($c3 == 0)
				$c3++;
			if($c4 == 0)
				$c4++;

			$ar = Array();
			$ar["eight"] = $eight/$c8;
			$ar["nine"] = $nine/$c9;
			$ar["ten"] = $ten/$c10;
			$ar["eleven"] = $eleven/$c11;
			$ar["twelve"] = $twelve/$c12;
			$ar["one"] = $one/$c1;
			$ar["two"] = $two/$c2;
			$ar["three"] = $three/$c3;
			$ar["four"] = $four/$c4;

			echo json_encode($ar);
		}
		else
			echo("lot average parked query failed");
	}

	function echoLotAverageOut($conn, $lotID)
	{
		$sql = "SELECT * FROM Stat WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);
		if($rs)
		{
			$eight = 0;
			$nine = 0;
			$ten = 0;
			$eleven = 0;
			$twelve = 0;
			$one = 0;
			$two = 0;
			$three = 0;
			$four = 0;

			$daycount = 1;

			$currentday = null;
			$lastparked = 0;

			while($row = $rs->fetch_assoc())
			{
				$date = strtotime($row["Date_Time"]);
				$parked = $row["Parked"];
				$day = date('D', $date);
				$hour = date('H', $date);

				if($day != 'Sat' && $day != 'Sun')
				{
					if($hour >= '08' && $hour < '17')
					{
						if($currentday == null)
						{
							$currentday = $day;
							$lastparked = $parked;
						}

						if($currentday != $day)
						{
							$currentday = $day;
							$lastparked = $parked;
							$daycount++;
						}

						if($parked < $lastparked)
						{
							if($hour == '08')
								$eight++;
							else if($hour == '09')
								$nine++;
							else if($hour == '10')
								$ten++;
							else if($hour == '11')
								$eleven++;
							else if($hour == '12')
								$twelve++;
							else if($hour == '13')
								$one++;
							else if($hour == '14')
								$two++;
							else if($hour == '15')
								$three++;
							else if($hour == '16')
								$four++;
						}
					}
				}
				$lastparked = $parked; 
			}

			$eight = $eight/$daycount;
			$nine = $nine/$daycount;
			$ten = $ten/$daycount;
			$eleven = $eleven/$daycount;
			$twelve = $twelve/$daycount;
			$one = $one/$daycount;
			$two = $two/$daycount;
			$three = $three/$daycount;
			$four = $four/$daycount;

			$ar = Array();
			$ar["eight"] = $eight;
			$ar["nine"] = $nine;
			$ar["ten"] = $ten;
			$ar["eleven"] = $eleven;
			$ar["twelve"] = $twelve;
			$ar["one"] = $one;
			$ar["two"] = $two;
			$ar["three"] = $three;
			$ar["four"] = $four;

			echo(json_encode($ar));
		}
		else 
			echo("get entries from stat by lotid query failed");
	}

	function echoLotAverageIn($conn, $lotID)
	{
		$sql = "SELECT * FROM Stat WHERE Lot_ID = ".$lotID;
		$rs = $conn->query($sql);
		if($rs)
		{
			$eight = 0;
			$nine = 0;
			$ten = 0;
			$eleven = 0;
			$twelve = 0;
			$one = 0;
			$two = 0;
			$three = 0;
			$four = 0;

			$daycount = 1;

			$currentday = null;
			$lastparked = 0;

			while($row = $rs->fetch_assoc())
			{
				$date = strtotime($row["Date_Time"]);
				$parked = $row["Parked"];
				$day = date('D', $date);
				$hour = date('H', $date);

				if($day != 'Sat' && $day != 'Sun')
				{
					if($hour >= '08' && $hour < '17')
					{
						if($currentday == null)
						{
							$currentday = $day;
							$lastparked = $parked;
						}

						if($currentday != $day)
						{
							$currentday = $day;
							$lastparked = $parked;
							$daycount++;
						}

						if($parked > $lastparked)
						{
							if($hour == '08')
								$eight++;
							else if($hour == '09')
								$nine++;
							else if($hour == '10')
								$ten++;
							else if($hour == '11')
								$eleven++;
							else if($hour == '12')
								$twelve++;
							else if($hour == '13')
								$one++;
							else if($hour == '14')
								$two++;
							else if($hour == '15')
								$three++;
							else if($hour == '16')
								$four++;
						}
					}
				}
				$lastparked = $parked; 
			}

			$eight = $eight/$daycount;
			$nine = $nine/$daycount;
			$ten = $ten/$daycount;
			$eleven = $eleven/$daycount;
			$twelve = $twelve/$daycount;
			$one = $one/$daycount;
			$two = $two/$daycount;
			$three = $three/$daycount;
			$four = $four/$daycount;

			$ar = Array();
			$ar["eight"] = $eight;
			$ar["nine"] = $nine;
			$ar["ten"] = $ten;
			$ar["eleven"] = $eleven;
			$ar["twelve"] = $twelve;
			$ar["one"] = $one;
			$ar["two"] = $two;
			$ar["three"] = $three;
			$ar["four"] = $four;

			echo(json_encode($ar));
		}
		else 
			echo("get entries from stat by lotid query failed");
	}

	function newLot($conn, $campusID, $lotname, $capacity)
	{
		if($sql = $conn->prepare("INSERT INTO Lot VALUES (?, ?, ?, ?, ?, ?, ?)"))
		{
			$fill = 0;
			$lotID = getLastLotID($conn) + 1;
			$sql->bind_param("iiiiiii", $lotID, $lotname, $capacity, $capacity, $fill, $fill, $campusID);

			
			

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
			$sql = "UPDATE Lot SET OpenSpots = ".$availability." WHERE Lot_ID = ".$lotID;
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
				echo "<option value='".$row["Lot_ID"]."'>".$row["LotNumber"]."</option>";
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
			$ar["LotName"] = $row["LotNumber"];
			$ar["Capacity"] = $row["Capacity"];
			$ar["OpenSpots"] =  $row["OpenSpots"];
			$ar["Lat"] = $row["Lat"];
			$ar["Lng"] = $row["Lng"];
			
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
