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
	

	// $dbhost = "host=mariadb55.websupport.sk;port=3310";
	// $dbuser = "examinator";
	// $dbpass = "BoSVKEO785";
	// $dbname = "examinator";
	// $dbh = new PDO ( "mysql:$dbhost;dbname=$dbname", $dbuser, $dbpass );
	// $dbh->setAttribute ( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	// $dbh->exec("set names utf8");
	// return $dbh;
 
}
?>