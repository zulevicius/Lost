<?php
$mysqli = new mysqli("localhost","root","","lost");
if (mysqli_connect_errno()) {
    printf("Can't connect to SQL Server. Error Code %s\n", mysqli_connect_error($mysqli));
    exit;
}

$oldProfilePic = $_POST['oldProfilePic'];
if (file_exists('images/'.$oldProfilePic))
{
	echo "old photo deleted\n";
	unlink('images/'.$oldProfilePic);
}
checkForModifiedExtension($oldProfilePic);

$mac = $_POST['mac'];
$mysqli->query("DELETE FROM Post WHERE macaddress = '$mac'");
echo "entity deleted";

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

?>