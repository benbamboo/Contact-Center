<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$UserID = $inData["UserID"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];

	$conn = new mysqli("localhost", "API", "API!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (Phone,FirstName,LastName, UserID, Email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $Phone, $FirstName,$LastName, $UserID, $Email);
		$stmt->execute();
		$stmt->close();
		$stmt = "select * from Contacts where ID = LAST_INSERT_ID()";
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
		$searchResults = '{"FirstName" : "' . $row["FirstName"]. '","LastName" : "' . $row["LastName"] .
 			'","Email" : "' . $row["Email"] . '","Phone" : "' . $row["Phone"] . '" }';
		sendResultInfoAsJson( $searchResults );
	}
	
?>
