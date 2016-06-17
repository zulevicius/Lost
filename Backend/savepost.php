<?php
$mysqli = new mysqli("localhost","root","","lost");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL Server. Error Code %s\n", mysqli_connect_error($mysqli));
    exit;
}
// Set the default namespace to utf8
$mac = $_POST['mac'];
$name = $_POST['name'];
$surname = $_POST['surname'];
$telephone = $_POST['telephone'];
$oldProfilePic = $_POST['oldProfilePic'];
$profilePic = $_POST['profilePic'];
$longitude = $_POST['longitude'];
$latitude = $_POST['latitude'];
$lastUpdate = $_POST['lastUpdate'];

//echo "\n".$_FILES['profilePicF']['size']==null."SIZE\n";
if (isset($_FILES['profilePicF']))
{
	$extension = pathinfo($_FILES['profilePicF']['name'])['extension'];
	$filename = $_POST['profilePic'].'.'.$extension;

	if (file_exists('images/'.$oldProfilePic))
	{
		echo "old photo deleted\n";
		unlink('images/'.$oldProfilePic);
	}
	checkForModifiedExtension($oldProfilePic);
	
	move_uploaded_file( $_FILES['profilePicF']['tmp_name'], 'images/'.$filename);
	Img_Resize('images/'.$filename);
}
else $filename = $_POST['oldProfilePic'];

$result = $mysqli->query("SELECT * FROM Post WHERE macaddress='$mac'");
if( $result->num_rows == 0 )
{
	echo "insert\n";
	$mysqli->query("INSERT INTO Post (macaddress, name, surname, telephone, profilePic, longitude, latitude, lastUpdate)
		VALUES('$mac', '$name', '$surname', '$telephone', '$filename', '$longitude', '$latitude', '$lastUpdate')");
}
else
{
	echo "update\n";
	$mysqli->query("UPDATE Post SET name = '$name', surname = '$surname', telephone = '$telephone',
		profilePic = '$filename', longitude = '$longitude', latitude = '$latitude', lastUpdate = '$lastUpdate'
		WHERE macaddress = '$mac'");
}
$mysqli->close();

function checkForModifiedExtension($oldFilename)
{
	$oldNameArray = explode(".", $oldFilename);
	$oldExtension = $oldNameArray[count($oldNameArray) - 1];

	if ($oldExtension !== "jpg" && $oldExtension !== "jpeg") 
		return;
	
	$oldFilename = "";
	for ($i = 0; $i < count($oldNameArray) - 1; $i++)
		$oldFilename = $oldFilename.$oldNameArray[$i].".";
		
	if ($oldExtension == "jpg") $oldExtension = "jpeg";
	else if ($oldExtension == "jpeg") $oldExtension = "jpg";
	$oldFilename = $oldFilename.$oldExtension;
	
	if (file_exists('images/'.$oldFilename))
	{
		echo "old photo deleted\n";
		unlink('images/'.$oldFilename);
	}
}

function Img_Resize($path)
{
	$x = getimagesize($path);            
	$width  = $x['0'];
	$height = $x['1'];

	$rs_height = 250;
	$rs_width  = $rs_height / $height * $width;

	switch ($x['mime']) {
		case "image/gif":
			$img = imagecreatefromgif($path);
			break;
		case "image/jpeg":
			$img = imagecreatefromjpeg($path);
			break;
		case "image/jpg":
			$img = imagecreatefromjpeg($path);
			break;
		case "image/png":
			$img = imagecreatefrompng($path);
			break;
	}

	$img_base = imagecreatetruecolor($rs_width, $rs_height);
	imagecopyresized($img_base, $img, 0, 0, 0, 0, $rs_width, $rs_height, $width, $height);

	$path_info = pathinfo($path);    
	switch ($path_info['extension']) {
		case "gif":
			imagegif($img_base, $path);  
			break;
		case "jpeg":
			imagejpeg($img_base, $path);  
			break;
		case "jpg":
			imagejpeg($img_base, $path);  
			break;
		case "png":
			imagepng($img_base, $path);  
			break;
	}
}
?>