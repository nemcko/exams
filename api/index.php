<?php
require 'Slim/Slim.php';
date_default_timezone_set('Europe/Bratislava');
session_start();
ini_set('max_execution_time', 0);
ini_set("memory_limit", "5G");
ini_set('post_max_size', '96M');
ini_set('upload_max_filesize', '96M');

// ini_set('display_errors',1);
// error_reporting(E_ALL);

$GLOBALS["HTTP_RAW_POST_DATA"] = file_get_contents("php://input");
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

require_once 'db.php';
require_once 'auth.php';
require_once 'jweety/Encoder.php';
require_once 'table.php';
require_once 'appdata.php';
require_once 'storage.php';
require_once 'validators.php';

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
// header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$app->post('/users/authenticate', function () use ($app) {
	$obj=new clsAuth();
	$obj->login();
});

$app->get('/validators/:oid', function ($oid) use ($app) {
	$obj=new clsValidators($oid,$app->request->get('field'),$app->request->get('value'));
});

$app->post('/user(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsUserList($cid,$id);
});

$app->post('/address(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsAddressList($cid,$id);
});

$app->post('/usradr(/:cid)', function ($cid='',$id='') use ($app) {
	$td=new clsUserAddress($id,$cid);
});
$app->post('/adrcli(/:cid)', function ($cid='',$id='') use ($app) {
	$td=new clsAdrCli($id,$cid);
});

$app->post('/client(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsClientList($cid,$id);
});

$app->post('/cliusrs(/:cid)', function ($cid='',$id='') use ($app) {
	$td=new clsClientUsers($id,$cid);
});

$app->post('/cliadrs(/:cid)', function ($cid='',$id='') use ($app) {
	$td=new clsClientAddress($id,$cid);
});

$app->post('/flyoffice(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsFlyofficeList($cid,$id);
});

$app->post('/examed(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsExamedList($cid,$id);
});

$app->post('/exagrps/:args+', function ($args) use ($app) {
	$td=new clsExagrps($args);
});

$app->get('/images/:uid/:type/:name', function ($uid,$type,$name) use ($app) {
	$obj=new clsWebImage($uid,$type,$name);
});

$app->post('/picture/:args+', function ($args) use ($app) {
	switch ($args[0]){
		case 'photo':
		case 'delphoto':
			$obj=new clsPicture($args);
		break;
	}
});

$app->post('/usrlng(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsUsrlngList($cid,$id);
});

$app->post('/usrdoc(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsUsrdocList($cid,$id);
});

$app->post('/usrdocument/:cid(/:id)', function ($cid,$id='') use ($app) {
	$td=new clsUsrDocument($cid,$id);
})->via('POST','DELETE','OPTIONS');

$app->post('/examdials/:cid', function ($cid,$id='') use ($app) {
	$td=new clsExamDials($cid,$id);
});

$app->post('/exams(/:id(/:cid))', function ($cid='',$id='') use ($app) {
	$td=new clsExams($cid,$id);

	// header_remove();
	// header("HTTP/1.1 200 OK",true,200);
	// header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
	// header('Content-Type: application/json');
	// echo json_encode(array('status' => 200,'message' => 'dgsgfdhgf'));
	// exit(0);
});

$app->post('/appdocument/:id(/:cid(/:name))', function ($id,$cid='',$name='') use ($app) {
	$td=new clsAppDocument($id,$cid,$name);
})->via('GET','POST','DELETE','OPTIONS');


// $app->get('/items/:args+', function ($args) use ($app) {
//    var_dump($args);
// });



// $app->map('/user', function () use ($app) {
// 	$td=new clsUser();
// })->via('POST','PUT','DELETE');



// $app->error(function (\Exception $e) use ($app) {
// 	// $app->$response->withJson($e,500);
// 	$app->response()->setStatus(404);
// 	echo '{"error":{"text":'. $e->getMessage() .'}}';
// });
$app->run();


