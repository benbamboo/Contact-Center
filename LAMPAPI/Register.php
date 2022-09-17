<?php
	$inData = getRequestInfo();
	
	//checks that all fields are filled
	$required = array('FirstName', 'LastName', 'Email','Password', 'Login');

	// Loop over field names, make sure each one exists and is not empty
	$empty = false;
	foreach($required as $field) {
	  if (empty($inData[$field])) {
	    $empty = true;
	  }
	}

	if ($empty) {
	  echo "All fields are required.";
	  exit();
	}


	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Email = $inData["Email"];
	$Login = $inData["Login"];
	$Password = $inData["Password"];
	
	$conn = new mysqli("localhost", "API", "API!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$stmt = "SELECT * FROM Users WHERE Login = '{$Login}'";

		$result = $conn->query($stmt);
		if (mysqli_num_rows($result)!=0){
			echo "Username already in use";
			exit();
		}



		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password, Email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $FirstName, $LastName, $Login, $Password,$Email);
		$stmt->execute();

		//return what was inserted
		$stmt = "select * from Users where ID = LAST_INSERT_ID()";
		$result = $conn->query($stmt);
		returnWithInfo($result->fetch_assoc());
		$conn->close();
		
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithInfo( $row )
	{
		$searchResults = '{"FirstName" : "' . $row["FirstName"]. '","LastName" : "' . $row["LastName"] . '","Login" : "' . $row["Login"]. '" }';
		sendResultInfoAsJson( $searchResults );
	}
	
?>
