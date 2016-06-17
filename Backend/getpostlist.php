<?php
$mysqli = new mysqli("localhost","root","","lost");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL Server. Error Code %s\n", mysqli_connect_error($mysqli));
    exit;
}
// Set the default namespace to utf8
$json    = array();
if ($result = $mysqli->query("SELECT * FROM Post ORDER BY lastUpdate DESC")) {
    while ($row=$result->fetch_assoc()) {
        $json[]=array
		(
            'id'=>$row['id'],
            'mac'=>$row['macaddress'],
            'name'=>$row['name'],
            'surname'=>$row['surname'],
            'telephone'=>$row['telephone'],
            'profilePic'=>$row['profilePic'],
            'latitude'=>$row['latitude'],
            'longitude'=>$row['longitude'],
            'lastUpdate'=>$row['lastUpdate']
        );
    }
}
$result->close();

header("Content-Type: text/json");
echo json_encode(array(    'posts'    =>    $json )); 

$mysqli->close(); 
?>