<?php
class clsTableData
{
	protected $_currentUser;
	protected $_crudCmd;
	protected $_cid;
	protected $_id;
	protected $_fields;
	protected $_fieldsAll;
	protected $_filename;
	protected $_method;
	protected $_args=false;
	
	public function __construct($cid='',$id='') {
		if (is_array($cid)){
			$this->_args=$cid;
		} else {
			// if (!preg_match('#[^0-9]#',$cid)){
			if (!preg_match('/^[a-z][a-z]*$/i',$cid)){
				$this->_cid=$id;
				$this->_id=$cid;
			} else {
				$this->_cid=$cid;
				$this->_id=$id;
			}
		}
		$this->loadPayloadData();
	}

	public function init($file,$fields,$fieldsAll='',$oid=''){
		$this->_filename = $file;
		$this->_fields = $fields;
		if($fieldsAll) {
			$this->_fieldsAll = $fieldsAll;
		} else {
			$this->_fieldsAll = $fields;
		}
	}

	public function getCommndId(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->qparams && array_key_exists('commandId',$this->_crudCmd->qparams)) {
			return 'app_'.strtolower($this->_crudCmd->qparams->commandId);
		} elseif ($this->_cid) {
			return 'app_'.strtolower($this->_cid);			
		} else exit(0);
	}

	protected function route($caller) {
		$this->_method=$_SERVER['REQUEST_METHOD'];

		// echo $this->_method; exit(0);
		// echo var_dump($this); exit(0);

		if ($this->_cid=='list') {
			if (method_exists($caller,'read')) return $caller->read();
			$this->sendData(); exit(0);
		} else {
			if ($this->_id && $this->_cid=='') {
				if (method_exists($caller,'detail')) 
					return $caller->detail();
				else				
					return $this->send1Data(); exit(0);
			} elseif ($this->_id && $this->_cid=='delete') {
				return $this->deleteData($caller); exit(0);
			} elseif ($this->_cid=='save') {
				return $this->deleteData($caller); exit(0);
			} 
		}
		$property=strtolower($this->_cid);
		// echo $property; exit(0);

		if (method_exists($caller,$property)) 
			$this->{$property}();
		else
			$this->sendError('Bad CRUD command');

	}

	public function loadPayloadData(){

		$this->_crudCmd = json_decode($GLOBALS["HTTP_RAW_POST_DATA"]);
		
		if (!$this->_crudCmd) {
			$this->sendError('CRUD command missing');
		}

		$auth=new clsAuth();
		$jwt=false;
		// echo json_encode($this->_crudCmd);

		if ($this->_crudCmd && array_key_exists('token',$this->_crudCmd)) $jwt=$this->_crudCmd->token;
		if (!$jwt ) $jwt=$auth->getToken();
		// echo json_encode($jwt); return;
		// echo json_encode($auth->check('exp',$jwt)); exit(0);


			if (!$jwt || $jwt && $auth->expired($jwt)) {
				$this->noAccess(408,'JWT token expired');
			}

		// echo json_encode($auth->check('sub',$jwt)); exit(0);
		$this->_currentUser=$auth->check('sub',$jwt);

		// echo var_dump($this); exit(0);

		if ($this->_crudCmd && array_key_exists('token',$this->_crudCmd)) {
			unset($this->_crudCmd->token);
		}
	}

	public function loadPostData($check=true){
		$auth=new clsAuth();
		$jwt=$auth->getToken();
		if ($check && (!$jwt || $jwt && $auth->expired($jwt))) {
			$this->noAccess(408,'JWT token expired');
		}
		$this->_crudCmd = (object) $_POST;
	}

	public function send1Data($query=''){
		$hasquery=false;
		if (!$query)
			$query='SELECT '.$this->_fieldsAll.' FROM '.$this->_filename .' WHERE id=\''.$this->_id.'\'';
		else
			$hasquery=true;

		// echo var_export($this->_crudCmd->id); exit;
		// if (!$this->_crudCmd || !$this->_crudCmd->id) return;

		
		$outdata=array();
		$db = getConn();
		try {
			$stmt = $db->prepare($query);
			$stmt->execute();
			$outdata = $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch(PDOException $e) { $this->sendError(e); };

		$this->_crudCmd->items=$outdata;

		if (array_key_exists('uuid',$this->_crudCmd)){
			unset($this->_crudCmd->uuid);
		}
		if (array_key_exists('qparams',$this->_crudCmd)){
			unset($this->_crudCmd->qparams);
		}

		header('Content-Type: application/json');
		echo json_encode($this->_crudCmd);
	}

	public function sendData($query=''){
		$hasquery=false;
		if (!$query)
			$query='SELECT '.$this->_fields.' FROM '.$this->_filename;
		else
			$hasquery=true;
		// $dump=var_export($query); return;

		$db = getConn();
		$total=0;

		if (!$hasquery && array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " WHERE ".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}

		// echo $query; exit(0);
		try {
			$stmt = $db->prepare($query);
			$stmt->execute();
			$total = $stmt->rowCount();
		} catch(PDOException $e) {
			$this->sendError($e);
		}

		if (!isset($this->_crudCmd->cid)) {
			$cid='#first';
		} else {
			switch ($this->_crudCmd->cid){
				case '#refresh':
				case '#first':
				case '#prev':
				case '#next':
				case '#last':
					$cid=$this->_crudCmd->cid;
				break;
				default:
					$cid='#first';
			}
		}
		if (!isset($this->_crudCmd->offset)) {
			$page = 1;
		} else{
			$page = $this->_crudCmd->offset;
		}

		if (!isset($this->_crudCmd->limit)) {
			$limit=15;
		} else {
			$limit=$this->_crudCmd->limit;
		}

		$pages = ceil($total/$limit);

		switch ($cid){
			case '#first': 
				$page=1;
				break;
			case '#prev':
				$page=max(1,$page-1);
				break;
			case '#next':
				$page=min($pages,$page+1);
				break;
			case '#last':
				$page=$pages;
				break;
		}

		$pquery=$query;

		$starting_limit = ($page-1)*$limit;
		$pquery=$pquery . " LIMIT $starting_limit, $limit";
		$outdata=array();

		try {
			$stmt2 = $db->prepare($pquery);
			$stmt2->execute();
			$outdata = $stmt2->fetchAll(PDO::FETCH_ASSOC);
		} catch(PDOException $e) {
			$this->sendError($e);
		}

		// unset($this->_crudCmd->cid);
		if (array_key_exists('uuid',$this->_crudCmd)){
			$this->_crudCmd->uuid=$this->_crudCmd->uuid;
		}
		$this->_crudCmd->offset=$page;
		$this->_crudCmd->limit=$limit;
		$this->_crudCmd->count=$total;
		$this->_crudCmd->pages=$pages;
		$this->_crudCmd->items=$outdata;

		if (array_key_exists('brwFieldName',$this->_crudCmd)){
			$this->_crudCmd->brwFieldName=$this->_crudCmd->brwFieldName;
			$this->_crudCmd->brwFieldValue=$this->_crudCmd->brwFieldValue;
		}
		if (array_key_exists('brwSortBy',$this->_crudCmd)){
			$this->_crudCmd->brwSortBy=$this->_crudCmd->brwSortBy;
			$this->_crudCmd->brwSortAsc=$this->_crudCmd->brwSortAsc;
		}
		if (array_key_exists('qparams',$this->_crudCmd)){
			unset($this->_crudCmd->qparams);
		}

		// $this->_crudCmd->stamp=time();
		// $this->_crudCmd->dump=$dump;
		// $this->_crudCmd->dump2=var_export($this->_crudCmd, true);

		$this->_crudCmd->sql=$pquery;

		header('Content-Type: application/json');
		echo json_encode($this->_crudCmd);
	}
	
	public function deleteData($caller){
		if (method_exists($caller,'delete')) return $caller->delete();

		$sql=$this->constructSql('delete');
		// $this->sendError($sql);	exit;
		// echo var_dump($this); exit(0);

		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			// $this->bindParam($stmt,$this->_id,'id');
			$stmt->execute();
			$db = null;
		} catch(PDOException $e) { $this->sendError(e); };
	}

	public function bindParam($stmt,$payload,$fieldname,$all=true){
		if (array_key_exists($fieldname,$payload) && $this->existInFields($fieldname,$all)){
			$stmt->bindParam($fieldname,$payload->$fieldname);
			return true;
		} else {
			return false;
		}
	}

	public function sanitize($data){
	  $data = trim($data);
	//   if( get_magic_quotes_gpc() ) {
		  $data = stripslashes($data);
	//   }
	//   $data = mysql_real_escape_string($data);
	  return $data;
	}

	protected function existInFields($fieldname,$all=true){
		if ($all)
			$fieldlist = explode(',',$this->_fieldsAll);
		else
			$fieldlist = explode(',',$this->_fields);
		return in_array($fieldname, $fieldlist);
	}

	public function constructSql($operation='') {
		$fields=array();
		$filename=$this->_filename;
		$sql="";
		if ($operation=='delete'){
			// $sql='DELETE FROM '.$filename.' WHERE id=:id';
			$sql='DELETE FROM '.$filename.' WHERE id=\''.$this->_id.'\'';
		} else
		if (array_key_exists('payload',$this->_crudCmd)){
			$record=$this->_crudCmd->payload;
			// if ($operation=='post'){
			if ($operation=='insert'){
				$flds=explode(',',$this->_fieldsAll);
				$fields=array();
				foreach ($flds as $key=>$val){
					if ($val!='id')
						$fields[]=$val;
				}
				$fields=implode(',',$fields);
				$fields= ' ('.$fields.')';
				$sql.=$fields;
				$fields=array();
				foreach ($flds as $key=>$val){
					if ($val!='id')
						$fields[]=':'.$val;
				}
				$fields=implode(',',$fields);
				$fields= ' VALUES('.$fields.')';
				$sql.=$fields;
				$sql='INSERT INTO '.$filename.' '.$sql;

			} else
			if (!$this->_id){
				foreach ($record as $key=>$val){
					if ($key!='id' && $this->existInFields($key))
						$fields[]=$key;
				}
				$fields=implode(',',$fields);
				$fields= ' ('.$fields.')';
				$sql.=$fields;
				$fields=array();
				foreach ($record as $key=>$val){
					if ($key!='id' && $this->existInFields($key))
						$fields[]=':'.$key;
				}
				$fields=implode(',',$fields);
				$fields= ' VALUES('.$fields.')';
				$sql.=$fields;
				$sql='INSERT INTO '.$filename.' '.$sql;
			} else {
				foreach ($record as $key=>$val){
					if ($key!='id' && $this->existInFields($key))
						$fields[]=$key.'=:'.$key;
				}
				$sql=implode(',',$fields);
				$sql='UPDATE '.$filename.' SET '.$sql.' WHERE id=:id';
			}
		} 
		return $sql;
	}

	public function friendlyName($name) {
		$name = preg_replace('~[^\\pL0-9_]+~u', '-', $name);
		$name = trim($name, "-");
		$name = iconv("utf-8", "us-ascii//TRANSLIT", $name);
		$name = strToLower($name);
		$name = preg_replace('~[^-a-z0-9_]+~', '', $name);
		return $name;
	}
	
	public function sendError($e){
		$message='';
		if ($e instanceof \PDOException) {
			$message=$e->getMessage();
		} else {
			$message=$e;
		}
		header('HTTP/1.1 500 Application error');
		// echo json_encode(array('error' => $this->friendlyName($message)));
		echo $message;
		exit(0);
	}

	public function noAccess ($code,$msg){
		$status = array(
			200 => '200 OK',
			400 => '400 Bad Request',
			403 => '403 Forbidden',
			408 => '408 Timeout',
			422 => 'Unprocessable Entity',
			500 => '500 Internal Server Error'
			);

		header_remove();
		header("HTTP/1.1 $status[$code]",true,$code);
		header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
		header('Content-Type: application/json');
		echo json_encode(array('status' => $code,'message' => $msg));
		exit(0);
	}

	public function addSqlField($fieldname,$fieldvalue){
		$this->_fieldsAll.=",$fieldname";
		$this->_crudCmd->payload->$fieldname=$fieldvalue;
	}

	public function getDate($stringvalue)
	{
		$stringvalue=str_replace(' ','',$stringvalue);
		if ($stringvalue) {
			if ( preg_match('/^(\d{1,2})(\/|-|\.)(\d{1,2})(\/|-|\.)(\d{4}).*$/', $stringvalue, $matches) ) {
				$val=sprintf('%04s-%02s-%02s',$matches[5],$matches[3],$matches[1]);
			} elseif ( preg_match('/^(\d{4})(-)(\d{2})(-)(\d{2}).*$/', $stringvalue, $matches) ) {
				$val=sprintf('%04s-%02s-%02s',$matches[1],$matches[3],$matches[5]);
			} else {
				$val=date('Y-m-d');
			}
			return $val;
		} else return null;
	}
	
	public function getRawDate($stringvalue)
	{
		return DateTime::createFromFormat('Y-m-d', $this->getDate($stringvalue));
		// return implode('/',array_reverse(explode('-',$this->getDate($stringvalue))));
	}

	public function getDatetime($stringvalue)
	{
		if (preg_match('~(\\d{4})-(\\d{2})-(\\d{2})[T\s](\\d{2}):(\\d{2}):(\\d{2})(.*)~', $stringvalue, $matches)) {
			return $matches[1] . "-" . $matches[2] . "-" . $matches[3] . " " . $matches[4] . ":" . $matches[5] . ":" . $matches[6];
		}
	 	return null;
	}
	
	public function getToDate($stringvalue)
	{
		$stringvalue=str_replace(' ','',$stringvalue);
		if ( preg_match('/^(\d{4})(-)(\d{2})(-)(\d{2}).*$/', $stringvalue, $matches) ) {
			return sprintf('%02s. %02s. %04s',$matches[5],$matches[3],$matches[1]);
		}
		return "";
	}

	public function getUserInfo($user=''){
		if (!$user) $user=$this->sanitize($this->_currentUser);
		$query = "SELECT usr,speaks,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='adm') as adm,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpes' AND parent = '') as lpes,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lprs' AND parent = '') as lprs,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpts' AND parent = '') as lpts,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpe') as lpe,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpr') as lpr,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpt') as lpt".
		" FROM users t1 WHERE t1.usr='{$this->sanitize($user)}' ";

		try {
			$db = getConn();
			$stmt = $db->prepare($query);
			$stmt->execute();
			return $stmt->fetch(PDO::FETCH_OBJ);
		} catch(PDOException $e) { 
			return false; 
		};
	}

	public function getSeniorUsr($type,$user=''){
		if (!$user) $user=$this->sanitize($this->_currentUser);
		$query = "SELECT parent FROM exagrps WHERE usr='{$user}' AND type='{$type}' AND parent<>'' ";
		// echo $query; exit(0);
		try {
			$db = getConn();
			$stmt = $db->prepare($query);
			$stmt->execute();
			$record=$stmt->fetch(PDO::FETCH_OBJ);
			return $record->parent;
		} catch(PDOException $e) { 
			return $user; 
		};
	}

	public function getUserQuery($userinfo){
		$qarray=array();		
		if (!$userinfo) return " false ";
		if ($userinfo->adm=='1') $qarray[]="true";
		if ($userinfo->lpes=='1') $qarray[]=$this->getUserAccQuery($userinfo->usr,'lpes');
		if ($userinfo->lprs=='1') $qarray[]=$this->getUserAccQuery($userinfo->usr,'lprs');
		if ($userinfo->lpts=='1') $qarray[]=$this->getUserAccQuery($userinfo->usr,'lpts');
		if ($userinfo->lpe=='1') $qarray[]=$this->getUserAccQuery($userinfo->usr,'lpe');
		if ($userinfo->lpr=='1') $qarray[]=$this->getUserAccQuery($userinfo->usr,'lpr');
		if ($userinfo->lpt=='1') $qarray[]=$this->getUserAccQuery($userinfo->usr,'lpt');

		return implode(' OR ',$qarray);
	}

	protected function getUserAccQuery($user,$examtype){
		return "(".
		"EXISTS(SELECT NULL FROM exausr AS eu INNER JOIN exagrps AS eg ON eu.idexa=eg.id WHERE t1.usr=eu.usr AND eg.usr='{$this->sanitize($user)}' AND eg.type='{$examtype}')".
		" OR ".
		"EXISTS(SELECT NULL FROM cliusrs AS cu INNER JOIN clients AS cl ON cl.id=cu.idcli INNER JOIN exacli AS ec ON ec.idcli=cl.id INNER JOIN exagrps AS eg ON eg.id=ec.idexa WHERE t1.usr=cu.usr AND eg.usr='{$this->sanitize($user)}' AND eg.type='{$examtype}')".
		")";
	}

	public function getExaQuery($userinfo,$exatype){
		$qarray=array();
		if (!$userinfo) return " false ";
		$exaarray = explode(',',$exatype);
		foreach ($exaarray as $key=>$val){
			switch ($val){
				case 'adm':
					if ($userinfo->adm=='1') $qarray[]="EXISTS(SELECT NULL FROM exagrps AS eg WHERE t1.usr=eg.usr)";
					break;
				case 'lpes':
					if ($userinfo->lpes=='1') $qarray[]=$this->getExaAccQuery($userinfo->usr,'lpes');
					break;
				case 'lprs':
					if ($userinfo->lprs=='1') $qarray[]=$this->getExaAccQuery($userinfo->usr,'lprs');
					break;
				case 'lpts':
					if ($userinfo->lpts=='1') $qarray[]=$this->getExaAccQuery($userinfo->usr,'lpts');
					break;
				case 'lpe':
					if ($userinfo->lpe=='1') $qarray[]=$this->getExaAccQuery($userinfo->usr,'lpe');
					break;
				case 'lpr':
					if ($userinfo->lpr=='1') $qarray[]=$this->getExaAccQuery($userinfo->usr,'lpr');
					break;
				case 'lpt':
					if ($userinfo->lpt=='1') $qarray[]=$this->getExaAccQuery($userinfo->usr,'lpt');
					break;
			}
		}
		return implode(' OR ',$qarray);
	}

	protected function getExaAccQuery($user,$examtype){
		return "(".
		// "t1.usr<>'{$this->sanitize($user)}'".
		// " AND ".
		"EXISTS(SELECT NULL FROM exagrps AS eg WHERE t1.usr=eg.usr AND eg.type='{$examtype}')".
		")";
	}

	public function getAvailUserQuery($lng,$user,$fieldname){
		$userinfo=$this->getUserInfo($user);
		$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 ';
		switch ($fieldname){
			case 'applicant':
				$query=$query . "WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ".
				$this->getUserQuery($userinfo).
				"";
				break;
			case 'assignedby':
			case 'lpeplaned':
			case 'lpereal':
				$query.="WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ";
				if ($userinfo->adm=='0')
					$query.="t1.usr<>'{$this->sanitize($user)}' AND ";
				$query.=$this->getExaQuery($userinfo,'adm,lpes,lpe');
				break;
			case 'lperespon':
				$query.="WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ";
				if ($userinfo->adm=='0')
					$query.="t1.usr<>'{$this->sanitize($user)}' AND ";
				$query.=$this->getExaQuery($userinfo,'adm,lpes');
				break;
			case 'lprplaned':
			case 'lprreal':
				$query.="WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ";
				if ($userinfo->adm=='0')
					$query.="t1.usr<>'{$this->sanitize($user)}' AND ";
				$query.=$this->getExaQuery($userinfo,'adm,lprs,lpr');
				break;
			case 'lprrespon':
				$query.="WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ";
				if ($userinfo->adm=='0')
					$query.="t1.usr<>'{$this->sanitize($user)}' AND ";
				$query.=$this->getExaQuery($userinfo,'adm,lprs');
				break;
			case 'appplaned':
			case 'appreal':
				$query.="WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ";
				if ($userinfo->adm=='0')
					$query.="t1.usr<>'{$this->sanitize($user)}' AND ";
				$query.=$this->getExaQuery($userinfo,'adm,apps,app');
				break;
			case 'apprespon':
				$query.="WHERE FIND_IN_SET('{$lng}', t1.speaks) AND ";
				if ($userinfo->adm=='0')
					$query.="t1.usr<>'{$this->sanitize($user)}' AND ";
				$query.=$this->getExaQuery($userinfo,'adm,apps');
				break;
		}
		return $query;
	}

	public function geRandomUser($lng,$exatype,$exceptuser=''){
		$type=substr($exatype,0,3);
		$query="SELECT DISTINCT u.usr FROM exagrps g INNER JOIN users u ON u.usr=g.usr WHERE g.type='{$type}s' AND g.parent<>'' AND u.usr<>'{$exceptuser}' AND FIND_IN_SET('{$lng}', u.speaks)";
		// $query="SELECT DISTINCT u.usr FROM exagrps g INNER JOIN users u ON u.usr=g.usr WHERE g.type='{$type}' AND g.parent='' AND FIND_IN_SET('{$lng}', u.speaks) ".
		//  "UNION SELECT DISTINCT u.usr FROM exagrps g INNER JOIN users u ON u.usr=g.usr WHERE g.type='{$type}s' AND g.parent<>'' AND FIND_IN_SET('{$lng}', u.speaks)";
		$users=array();
		try {
			$db = getConn();
			$stmt = $db->prepare($query);
			$stmt->execute();
			$users=$stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch(PDOException $e) { 
			return ""; 
		};

// echo $query; exit(0);
// echo var_dump($users); exit(0);

		if (empty($users)) return ""; 

// echo $users[array_rand($users)]['usr']; exit(0);

		return $users[array_rand($users)]['usr'];
	}

}
?>