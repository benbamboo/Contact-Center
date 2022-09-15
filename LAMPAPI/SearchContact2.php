<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "API", "API!", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ?) AND (Email like ?) AND (Phone like ?) AND UserID=?");
		//echo($FirstName);
		$name = "%" .$inData["Name"]. "%";
		$email = "%" .$inData["Email"]. "%";
		$phone = "%" .preg_replace("/[^a-zA-Z0-9]+/", "", $inData["Phone"]). "%";
	        $stmt->bind_param("sssss", $name,$name, $email, $phone, $inData["UserID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			//$searchResults .= '"' . $row["FirstName"] . '"';
			$searchResults .= '{"FirstName" : "' . $row["FirstName"]. '","LastName" : "' . $row["LastName"] .
 			'","Email" : "' . $row["Email"] . '","ID" : "' . $row["ID"]. '","Phone" : "' . $row["Phone"] . '" }';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
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
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>