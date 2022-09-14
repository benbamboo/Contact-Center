<?php
	$inData = getRequestInfo();
	$conn = new mysqli("localhost", "API", "API!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("delete from Contacts where ID = ?");
		$stmt->bind_param("s", $inData["ID"]);
		$stmt->execute();
		$stmt->close();
		echo "Successfully deleted";
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
	
?>
