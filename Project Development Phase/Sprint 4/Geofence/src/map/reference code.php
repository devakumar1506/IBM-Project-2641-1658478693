<?php

function query($id,$path=null,$start,$end){

$servername = "169.62.131.56";
$username = "tommy";
$password = "tommyBoatrax01!";
$dbname = "boatrax";

$conn = mysqli_connect($servername, $username, $password,$dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT 
    measurement,
    DATE_FORMAT(STR_TO_DATE(`timestamp`, '%Y-%m-%dT%H:%i:%s.%fZ'),
            '%Y-%m-%d %H:%i:%s') AS timestampformat,
    value
FROM
    boat_raw_logs
WHERE
    boat_id = '$id'
        AND DATE_FORMAT(STR_TO_DATE(`timestamp`, '%Y-%m-%dT%H:%i:%s.%fZ'),
            '%Y-%m-%d %H:%i:%s') BETWEEN '$start' AND '$end'
        AND measurement NOT LIKE ('navigation%')
        
";

if(!empty($path))
	$sql .= "AND measurement = '$path'";

$result = $conn->query($sql);

// $resultarray = array("path"=>$path,"info"=>array());
$resultarray = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    	//build here the array of points

    	if(!array_key_exists($row['measurement'], $resultarray))
    		$resultarray[$row['measurement']] = array();

    	array_push($resultarray[$row['measurement']],array($row['timestampformat'],$row['value']) );

    	//$resultarray[$row['measurement']] = $array_of_points;
      //array_push($resultarray['info'], array($row['timestampformat'],$row['value']));
    }
} else {
    echo "0 results";
}

$myjson = json_encode($resultarray);

echo $myjson;

return $myjson;
$conn->close();

}

function query2($id,$path=null,$start,$end){

$servername = "169.62.131.56";
$username = "tommy";
$password = "tommyBoatrax01!";
$dbname = "boatrax";

$conn = mysqli_connect($servername, $username, $password,$dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT 
    measurement,
    DATE_FORMAT(STR_TO_DATE(`timestamp`, '%Y-%m-%dT%H:%i:%s.%fZ'),
            '%Y-%m-%d %H:%i:%s') AS timestampformat,
    value
FROM
    boat_raw_logs
WHERE
    boat_id = '$id'
        AND DATE_FORMAT(STR_TO_DATE(`timestamp`, '%Y-%m-%dT%H:%i:%s.%fZ'),
            '%Y-%m-%d %H:%i:%s') BETWEEN '$start' AND '$end'
        AND measurement NOT LIKE ('navigation%') 
        
";

if(!empty($path))
    //$sql .= "AND measurement = '$path' ";
    $sql .= "AND measurement LIKE ('%$path%')";

$sql .= "ORDER BY timestampformat";

$result = $conn->query($sql);

// $resultarray = array("path"=>$path,"info"=>array());
$resultarray = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        //build here the array of points

        if(!array_key_exists($row['timestampformat'], $resultarray))
            $resultarray[$row['timestampformat']] = array();

        $resultarray[$row['timestampformat']][$row['measurement']] = $row['value'];
        //$resultarray[$row['measurement']] = $array_of_points;
      //array_push($resultarray['info'], array($row['timestampformat'],$row['value']));
    }
} else {
    echo "0 results";
}

$myjson = json_encode($resultarray);

echo $myjson;

return $myjson;
$conn->close();

}

query2('214e1d65-e6a4-40ff-a366-2793519c0d59','revolutions','2018-05-01 00:00:00','2018-05-25 14:00:00');
?>
[[date,value1,value2],[date,value1,value2],[date,value1,value2],[date,value1,value2],[date,value1,value2],[date,value1,value2],[date,value1,value2],[date,value1,value2]]

let array_of_point = [];
_.map(jsonObject, (value,key)=>{
    
    let tmp = [key,value[""], value[""]]

})