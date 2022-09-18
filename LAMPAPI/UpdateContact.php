<?php
    $inData = getRequestInfo();
    
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $ID = $inData["ID"];
    $Phone = preg_replace("/[^a-zA-Z0-9]+/", "", $inData["Phone"]);
    $Email = $inData["Email"];

    $conn = new mysqli("localhost", "API", "API!", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName =?, LastName =?, Email =?, Phone =? WHERE ID=?");
        $stmt->bind_param("ssssi", $FirstName, $LastName, $Email, $Phone, $ID);
        $stmt->execute();
        $stmt->close();
        $stmt = "select * from Contacts where ID = " . $ID;
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