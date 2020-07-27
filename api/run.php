<?php
date_default_timezone_set('Europe/Bratislava');
session_start();

require 'Slim/Slim.php';
require_once 'config.php';
require_once 'camdata.php';
require_once 'appdata.php';
require_once 'statist.php';

$GLOBALS["HTTP_RAW_POST_DATA"] = file_get_contents("php://input");
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->get('/:id', function ($id) use ($app) {	
	switch ($id){
		case 'loadcam':
			$obj=new clsCamdata();
			$obj->loadcam();
			break;
		case 'refresh':
			$obj=new clsCamdata();
			$obj->refresh();
			break;
		case 'loadAll':
			$obj=new clsCamdata();
			$obj->loadAll();
			break;
		default:			
			echo 'Bad command: ' . $id; exit();
	}
	echo $id.' finished at '.date("Y-m-d H:i:s");exit();
});

$app->run();