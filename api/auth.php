<?php
require_once 'jweety/EncoderInterface.php';

class clsAuth
{
	private $secret;
	private $key;
	private $iv;

	function __construct($password='') {
		$this->setSecret($password);
	}
		
	public function setSecret($password='') 
	{
		if ( $password ) {
			$this->secret=md5($password);
		} else {
			// $this->secret=md5(md5(session_id()));
			$this->secret=md5(md5('Security Token'));
		}
		$this->key=substr($this->secret, 0, 24);
		$this->iv=substr($this->secret, 0, 8);
	}
	
	public function toHex($string)
	{
		for ($i=0; $i<strlen($string); $i++){
			$ord = ord($string[$i]);
			$hexCode = dechex($ord);
			$hex .= substr('0'.$hexCode, -2);
		}
		return strToUpper($hex);
	}

	public function decrypt($text,$bParam=false,$password=null)
	{
		if ( $password ) {
			$secret=md5($password);
			$key=substr($secret, 0, 24);
			$iv=substr($secret, 0, 8);
		} else {
			$secret=$this->secret;
			$key=$this->key;
			$iv=$this->iv;
		}
		
		if ( $bParam ) {
			$text=urldecode($text);
			$text=str_replace(" ", "+", $text);
		}
		if (preg_match('%^[a-zA-Z0-9/+]*={0,2}$%', $text)) {
			$text = base64_decode($text);
		}
		if ( $this->key ) {
			$decrypted = mcrypt_decrypt(MCRYPT_3DES, $key, $text, MCRYPT_MODE_CBC, $iv);
			$decrypted = $this->pkcs5_unpad($decrypted);
			$decrypted = json_decode(rtrim($decrypted));
		} else {
			$iv = substr($this->secret, 0, 8);
			$key = substr($this->secret, 0, 24);
			$decrypted = mcrypt_decrypt(MCRYPT_3DES, $key, $text, MCRYPT_MODE_CBC, $iv);
		}
		return $decrypted;
	}

	public function encrypt($obj,$password='')
	{
		if ( $password ) {
			$secret=md5($password);
			$key=substr($secret, 0, 24);
			$iv=substr($secret, 0, 8);
		} else {
			$secret=$this->secret;
			$key=$this->key;
			$iv=$this->iv;
		}
		if ( $this->key ) {
			$plain_text=json_encode($obj);
			$size = mcrypt_get_block_size(MCRYPT_TRIPLEDES, 'ecb');
			$plain_text = $this->pkcs5_pad($plain_text, $size);
			$crypted = mcrypt_encrypt(MCRYPT_3DES, $key, $plain_text, MCRYPT_MODE_CBC, $iv);
		} else {
			$plain_text= iconv(mb_detect_encoding($plain_text, mb_detect_order(), true), "UTF-8", $plain_text);
			$plain_text = trim($plain_text);
			$key = substr($this->secret, 0, 24);
			$iv = substr($this->secret, 0, 8);
			$crypted = mcrypt_encrypt(MCRYPT_3DES, $key, $plain_text, MCRYPT_MODE_CBC, $iv);
		}
		return base64_encode($crypted);
	}
	
	protected function pkcs5_pad($text, $blocksize)
	{
		$pad = $blocksize - (strlen($text) % $blocksize);
		return $text . str_repeat(chr($pad), $pad);
	}
	
	protected function pkcs5_unpad($text)
	{
		$pad = ord($text{strlen($text)-1});
		if ($pad > strlen($text)) return false;
		return substr($text, 0, -1 * $pad);
	}

	public function genPassword($lenpwd=6)
	{
		$chars="abcdefghijklmnopqrstuvwxyz123456789";
		$len = strlen($chars);
		$pw = '';
		for ($i=0;$i<$lenpwd;$i++) {
			$pw .= substr($chars, rand(0, $len-1), 1);
		}
		$pw = str_shuffle($pw);
		return $pw;
	}
	
	public function login(){
		
		$req = json_decode($GLOBALS["HTTP_RAW_POST_DATA"]);

		// echo json_encode($req); exit(0);

		if (!isset($req->usr)) return;

		$db = getConn();
		
		try {
			$stmt = $db->prepare("SELECT id,pwd,firstname,lastname,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='adm') as adm,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='lpes' AND parent = '') as lpes,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='lprs' AND parent = '') as lprs,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='lpts' AND parent = '') as lpts,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='lpe') as lpe,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='lpr') as lpr,
			EXISTS(SELECT 1 FROM exagrps WHERE usr =:username AND type='lpt') as lpt
			FROM users WHERE usr=:username");
			$stmt->bindParam("username", $req->usr);
			$stmt->execute();
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
		} catch(PDOException $e) {
			// echo json_encode($e);
			return;
		}

		if (!$user) return;

		$password=$this->encrypt($req->pwd,$req->usr);
		$token='';

		// echo json_encode($user); exit(0);

		// if ( isset($user['pwd']) && $user['pwd']==$password){
		if ( isset($user['pwd']) && $user['pwd']==$password || !isset($user['pwd'])){
			$stamp= time();
			$claims = array(
				'aud' => $_SERVER["REMOTE_ADDR"].':'.$_SERVER["REMOTE_PORT"], //Audience
				'iat' => $stamp, // Issued At 
				'exp' => $stamp + 24*60*60, //ExpirationTime
				'nbf' => $stamp + 10, //NotBeforeTime
				'sub' => $req->usr, //Subject 
				'adm'=> $user['adm'],
				'lpes'=> $user['lpes'],
				'lprs'=> $user['lprs'],
				'lpts'=> $user['lpts'],
				'lpe'=> $user['lpe'],
				'lpr'=> $user['lpr'],
				'lpt'=> $user['lpt'],
			);	

			$encoder = new jweety\Encoder($this->secret);
			$token = $encoder->stringify($claims);
			$retdata=array(
				'usr'=> $req->usr,
				'name'=> $user['firstname'].' '.$user['lastname'],
				'token'=> $token,
				// 'aud'=> $claims['aud'],
				'iat'=> $claims['iat'],
				'exp'=> $claims['exp'],
				// 'nbf'=> $claims['nbf'],
				// 'sub'=> $claims['sub'],
				'access'=> (object) array(
					'adm'=> $user['adm']=="1",
					'lpes'=> $user['lpes']=="1",
					'lprs'=> $user['lprs']=="1",
					'lpts'=> $user['lpts']=="1",
					'lpe'=> $user['lpe']=="1",
					'lpr'=> $user['lpr']=="1",
					'lpt'=> $user['lpt']=="1",
				)
			);
			header('Content-Type: application/json');
			echo json_encode($retdata);
		}
		
	}
	
	public function check($part,$jwt){
		$encoder = new jweety\Encoder($this->secret);
		try {
			$claims = $encoder->parse($jwt, false);
		} 
		catch(InvalidArgumentException $e) {
			return null;
		}
		catch(RuntimeException $e) {
			return null;
		}
		if ($claims->$part)
			return $claims->$part;
		else
			return null;
	}

	public function expired($jwt){
		$expire=$this->check('exp',$jwt);

		if (!$expire || $expire < time()) return true;
		return false;
	}

	private function getAuthorizationHeader(){
		$headers = null;
		if (function_exists('getallheaders'))
        {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $authorization = $headers['Authorization'];
            }
        } elseif (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
		}
		
        return $headers;
	}
	
	public function getToken() {
		$headers = $this->getAuthorizationHeader();

		if (!empty($headers) && array_key_exists('Authorization',$headers)) {
			$headers=$headers['Authorization'];
			if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
				return $matches[1];
			}
		}
		return false;
	}
}
?>