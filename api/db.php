<?php
function getConn() {

	$dbhost = "127.0.0.1";
	$dbuser = "root";
	$dbpass = "";
	$dbname = "examinator";
	$dbh = new PDO ( "mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass );
	$dbh->setAttribute ( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	$dbh->exec("set names utf8");
	return $dbh;
 
}
?>
