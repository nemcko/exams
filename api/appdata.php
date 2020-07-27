<?php

class clsBase extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init('field, ....',$oid);
		$this->route($this);
	}

	protected function read(){
		$this->sendData();
	}

	protected function detail(){
		$this->sendData1();
	}

	protected function create(){
		$this->sendData();
	}

	protected function update(){
		$this->sendData();
	}
	
	protected function delete(){
		$this->sendData();
	}
}



class clsUserList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'users',
			't1.id,t1.usr,t1.firstname,t1.lastname',
			'id,usr,firstname,lastname,phone,mobile,web,profession,speaks'
		);
		$this->route($this);
	}

	protected function read(){
		$this->_fields.=",EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='adm') as adm,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpes' AND parent = '') as lpes,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lprs' AND parent = '') as lprs,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpts' AND parent = '') as lpts,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpe') as lpe,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpr') as lpr,".
		"EXISTS(SELECT 1 FROM exagrps WHERE usr=t1.usr AND type='lpt') as lpt";

				// echo var_dump($this); exit(0);

		$query='SELECT '.$this->_fields.' FROM '.$this->_filename.' t1';

		if (array_key_exists('qparams',$this->_crudCmd) && array_key_exists('exafilter',$this->_crudCmd->qparams) ) {
			$where="";
			if ($this->_crudCmd->qparams->exafilter->lpes) $where.=(($where)?' OR ':'')."t1.usr=tx.usr AND tx.type='lpes' AND parent=''";
			if ($this->_crudCmd->qparams->exafilter->lprs) $where.=(($where)?' OR ':'')."t1.usr=tx.usr AND tx.type='lprs' AND parent=''";
			if ($this->_crudCmd->qparams->exafilter->lpts) $where.=(($where)?' OR ':'')."t1.usr=tx.usr AND tx.type='lpts' AND parent=''";
			if ($this->_crudCmd->qparams->exafilter->lpe) $where.=(($where)?' OR ':'')."t1.usr=tx.usr AND tx.type='lpe' AND parent=''";
			if ($this->_crudCmd->qparams->exafilter->lpr) $where.=(($where)?' OR ':'')."t1.usr=tx.usr AND tx.type='lpr' AND parent=''";
			if ($this->_crudCmd->qparams->exafilter->lpt) $where.=(($where)?' OR ':'')."t1.usr=tx.usr AND tx.type='lpt' AND parent=''";
			if ($where) $query.=" WHERE EXISTS(SELECT 1 FROM exagrps tx WHERE {$where}) ";
			if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
				if ($where) 
					$query=$query . ' AND '.$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
				else
					$query=$query . ' WHERE '.$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
			}
		} else {
			if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
				$query=$query . " WHERE ".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
			}	
		}
	
		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function update(){
		$this->addSqlField('fullsearch',
			$this->_crudCmd->payload->lastname.", ".
			$this->_crudCmd->payload->firstname.", ".
			$this->_crudCmd->payload->usr.", ".
			$this->_crudCmd->payload->phone.", ".
			$this->_crudCmd->payload->mobile.", ".
			$this->_crudCmd->payload->web.", "
		);
		$sql=$this->constructSql();
		// $this->sendError($sql);	exit;
		// echo var_dump($this->_crudCmd->payload); exit(0);
	



		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			if ($this->_id) $stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'fullsearch');
			$this->bindParam($stmt,$this->_crudCmd->payload,'usr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'firstname');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lastname');
			$this->bindParam($stmt,$this->_crudCmd->payload,'phone');
			$this->bindParam($stmt,$this->_crudCmd->payload,'mobile');
			$this->bindParam($stmt,$this->_crudCmd->payload,'web');
			$this->bindParam($stmt,$this->_crudCmd->payload,'profession');
			$this->bindParam($stmt,$this->_crudCmd->payload,'speaks');
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}	
}

class clsAddressList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'addresses',
			'id,street,house_number,zip,city,state,latitude,longitude,creator',
			'id,street,house_number,zip,city,state,latitude,longitude'
		);
		$this->route($this);
	}

	protected function update(){
		// echo var_dump($this); exit(0);
		if (!$this->_id) $this->addSqlField('creator',$this->_currentUser);
		$this->addSqlField('fullsearch',
			$this->_crudCmd->payload->house_number.", ".
			$this->_crudCmd->payload->street.", ".
			$this->_crudCmd->payload->city.", ".
			$this->_crudCmd->payload->zip.", ".
			$this->_crudCmd->payload->state.", "
		);
		// echo var_dump($this); exit(0);
		$sql=$this->constructSql();
		// $this->sendError($sql);	exit;

		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			if ($this->_id) $stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'fullsearch');
			$this->bindParam($stmt,$this->_crudCmd->payload,'street');
			$this->bindParam($stmt,$this->_crudCmd->payload,'house_number');
			$this->bindParam($stmt,$this->_crudCmd->payload,'zip');
			$this->bindParam($stmt,$this->_crudCmd->payload,'city');
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'longitude');
			$this->bindParam($stmt,$this->_crudCmd->payload,'latitude');
			if (!$this->_id) $this->bindParam($stmt,$this->_crudCmd->payload,'creator');
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}	

	protected function delete(){
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM cliadrs WHERE idaddr=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
			
			$stmt = $db->prepare("DELETE FROM adrusrs WHERE idaddr=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
			
			$stmt = $db->prepare("UPDATE flyoffices SET idaddr='' WHERE idaddr=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();

			$stmt = $db->prepare("DELETE FROM addresses WHERE id=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->sendData();
	}

}

class clsUserAddress extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		// echo var_dump($this); exit(0);

		$property=$this->getCommndId();
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_alist(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId)
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE NOT EXISTS(SELECT NULL FROM adrusrs t2 WHERE t2.usr = t1.usr AND t2.idaddr='.$this->_crudCmd->qparams->addressId.')';
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_list(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId)
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE EXISTS(SELECT NULL FROM adrusrs t2 WHERE t2.usr = t1.usr AND t2.idaddr='.$this->_crudCmd->qparams->addressId.')';
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}

		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_add(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->userid){
			$query="INSERT INTO adrusrs (idaddr,usr) VALUES(:idaddr,:usr)";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idaddr", $this->_crudCmd->qparams->addressId);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userid);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_alist();
	}

	protected function app_del(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->userid){
			$query="DELETE FROM adrusrs WHERE idaddr=:idaddr AND usr=:usr";
			// echo var_dump($this); exit(0);
			// echo $query; exit(0);
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idaddr", $this->_crudCmd->qparams->addressId);
				$stmt->bindParam("usr",$this->_crudCmd->payload->userid);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_list();
	}

}

class clsClientList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'clients',
			'id,code,name,ico,icdph,dic,phone,email,agreement',
			'id,code,name,ico,icdph,dic,comment,phone,email,agreement'
		);
		$this->route($this);
	}

	protected function update(){
		// echo var_dump($this); exit(0);
		if (!$this->_id) $this->addSqlField('creator',$this->_currentUser);
		$this->addSqlField('fullsearch',
			$this->_crudCmd->payload->name.", ".
			$this->_crudCmd->payload->code.", ".
			$this->_crudCmd->payload->agreement.", ".
			$this->_crudCmd->payload->ico.", ".
			$this->_crudCmd->payload->icdph.", ".
			$this->_crudCmd->payload->phone.", ".
			$this->_crudCmd->payload->email.", "
		);
		// echo var_dump($this); exit(0);
		$sql=$this->constructSql();
		// $this->sendError($sql);	exit;

		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			if ($this->_id) $stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'fullsearch');
			$this->bindParam($stmt,$this->_crudCmd->payload,'code');
			$this->bindParam($stmt,$this->_crudCmd->payload,'name');
			$this->bindParam($stmt,$this->_crudCmd->payload,'ico');
			$this->bindParam($stmt,$this->_crudCmd->payload,'icdph');
			$this->bindParam($stmt,$this->_crudCmd->payload,'dic');
			$this->bindParam($stmt,$this->_crudCmd->payload,'comment');
			$this->bindParam($stmt,$this->_crudCmd->payload,'phone');
			$this->bindParam($stmt,$this->_crudCmd->payload,'email');
			$this->bindParam($stmt,$this->_crudCmd->payload,'agreement');
			if (!$this->_id) $this->bindParam($stmt,$this->_crudCmd->payload,'creator');
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}
	
	protected function delete(){
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM cliadrs WHERE idcli=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
			
			$stmt = $db->prepare("DELETE FROM cliusrs WHERE idcli=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
			
			$stmt = $db->prepare("DELETE FROM clients WHERE id=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->sendData();
	}

}

class clsUserClients extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		// echo var_dump($this); exit(0);

		$property=$this->getCommndId();
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_alist(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE NOT EXISTS(SELECT NULL FROM cliusrs t2 WHERE t2.usr = t1.usr AND t2.idcli='.$this->_crudCmd->qparams->clientId.')';
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_list(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE EXISTS(SELECT NULL FROM cliusrs t2 WHERE t2.usr = t1.usr AND t2.idcli='.$this->_crudCmd->qparams->clientId.')';
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}

		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_add(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->userid){
			$query="INSERT INTO cliusrs (idcli,usr) VALUES(:idcli,:usr)";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userid);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_alist();
	}

	protected function app_del(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->userid){
			$query="DELETE FROM cliusrs WHERE idcli=:idcli AND usr=:usr";
			// echo var_dump($this); exit(0);
			// echo $query; exit(0);
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("usr",$this->_crudCmd->payload->userid);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_list();
	}

}

class clsClientUsers extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		// echo var_dump($this); exit(0);

		$property=$this->getCommndId();
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_alist(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE NOT EXISTS(SELECT NULL FROM cliusrs t2 WHERE t2.usr = t1.usr AND t2.idcli='.$this->_crudCmd->qparams->clientId.')';
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_list(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE EXISTS(SELECT NULL FROM cliusrs t2 WHERE t2.usr = t1.usr AND t2.idcli='.$this->_crudCmd->qparams->clientId.')';
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}

		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_add(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->userid){
			$query="INSERT INTO cliusrs (idcli,usr) VALUES(:idcli,:usr)";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userid);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_alist();
	}

	protected function app_del(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->userid){
			$query="DELETE FROM cliusrs WHERE idcli=:idcli AND usr=:usr";
			// echo var_dump($this); exit(0);
			// echo $query; exit(0);
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("usr",$this->_crudCmd->payload->userid);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_list();
	}

}

class clsClientAddress extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		// echo var_dump($this); exit(0);

		$property=$this->getCommndId();
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_alist(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT t1.id,t1.state,t1.city,t1.zip,t1.house_number,t1.street FROM addresses t1 WHERE NOT EXISTS(SELECT NULL FROM cliadrs t2 WHERE t2.idaddr = t1.id AND t2.idcli='.$this->_crudCmd->qparams->clientId.')';
		else
			$query='SELECT t1.id,t1.state,t1.city,t1.zip,t1.house_number,t1.street FROM addresses t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_list(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT t1.id,t1.state,t1.city,t1.zip,t1.house_number,t1.street FROM addresses t1 WHERE EXISTS(SELECT NULL FROM cliadrs t2 WHERE t2.idaddr = t1.id AND t2.idcli='.$this->_crudCmd->qparams->clientId.')';
		else
			$query='SELECT t1.id,t1.state,t1.city,t1.zip,t1.house_number,t1.street FROM addresses t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}

		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_add(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->addressId){
			$query="INSERT INTO cliadrs (idcli,idaddr) VALUES(:idcli,:iaddr)";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("iaddr", $this->_crudCmd->payload->addressId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_alist();
	}

	protected function app_del(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->addressId){
			$query="DELETE FROM cliadrs WHERE idcli=:idcli AND idaddr=:iaddr";
			// echo var_dump($this); exit(0);
			// echo $query; exit(0);
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("iaddr",$this->_crudCmd->payload->addressId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_list();
	}

}

class clsAdrCli extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		// echo var_dump($this); exit(0);

		$property=$this->getCommndId();
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_alist(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId)
			$query='SELECT t1.id,t1.name,t1.code,t1.ico,t1.dic,t1.icdph FROM clients t1 WHERE NOT EXISTS(SELECT NULL FROM cliadrs t2 WHERE t2.idcli = t1.id AND t2.idaddr='.$this->_crudCmd->qparams->addressId.')';
		else
			$query='SELECT t1.id,t1.name,t1.code,t1.ico,t1.dic,t1.icdph FROM clients t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_list(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId)
			$query='SELECT t1.id,t1.name,t1.code,t1.ico,t1.dic,t1.icdph FROM clients t1 WHERE EXISTS(SELECT NULL FROM cliadrs t2 WHERE t2.idcli = t1.id AND t2.idaddr='.$this->_crudCmd->qparams->addressId.')';
		else
			$query='SELECT t1.id,t1.name,t1.code,t1.ico,t1.dic,t1.icdph FROM clients t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}

		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_add(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->clientId){
			$query="INSERT INTO cliadrs (idcli,idaddr) VALUES(:idcli,:iaddr)";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("iaddr", $this->_crudCmd->qparams->addressId);
				$stmt->bindParam("idcli", $this->_crudCmd->payload->clientId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_alist();
	}

	protected function app_del(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->addressId &&
			$this->_crudCmd->payload && $this->_crudCmd->payload->clientId){
			$query="DELETE FROM cliadrs WHERE idcli=:idcli AND idaddr=:iaddr";
			// echo var_dump($this); exit(0);
			// echo $query; exit(0);
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("iaddr", $this->_crudCmd->qparams->addressId);
				$stmt->bindParam("idcli",$this->_crudCmd->payload->clientId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_list();
	}

}

class clsFlyofficeList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'flyoffices',
			't1.id,t1.name,t1.idaddr,t2.house_number,t2.street,t2.zip,t2.city,t2.state',
			'id,name,idaddr'
		);
		$this->query='SELECT '.$this->_fields.' FROM '.$this->_filename.' AS t1 LEFT OUTER JOIN addresses AS t2 ON t1.idaddr=t2.id';
		$this->route($this);
	}

	protected function read(){
		$this->sendData($this->query);
	}

	protected function detail(){
		$this->query.=' WHERE t1.id='.$this->_id;
		$this->sendData($this->query);
	}

	protected function update(){
		$sql=$this->constructSql();
		if ($this->_crudCmd->payload->idaddr)
			$sql=str_replace(':idaddr',$this->_crudCmd->payload->idaddr,$sql);
		else
			$sql=str_replace(':idaddr',0,$sql);

		// $this->sendError($sql);	exit;
		// echo var_dump($this->_crudCmd->payload); exit(0);	
		// echo var_dump($this); exit(0);	
		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			if ($this->_id) $stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'name');
			// if ($this->_crudCmd->payload->idaddr)
			// 	$stmt->bindParam("idaddr",$this->_crudCmd->payload->idaddr);
			// else
			// 	$stmt->bindParam("idaddr",0);
			$stmt->execute();
			// if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->sendData($this->query);
	}	
}

class clsExagrps extends clsTableData 
{
	public function __construct($args) {
		parent::__construct($args);
		// if (!ount($args)) return $this->sendError('Bad CRUD command');
		// echo var_dump($this); exit(0);

		$property='app_'.end($this->_args);
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_list(){
		if (isset($this->_crudCmd->qparams) && $this->_crudCmd->qparams->examtype) 
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1  INNER JOIN exagrps tx ON t1.usr=tx.usr WHERE tx.type='{$this->_crudCmd->qparams->examtype}' AND EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.parent='' AND t2.usr = t1.usr AND t2.type='{$this->_crudCmd->qparams->examtype}')";
		else
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1 WHERE EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.parent='' AND t2.usr = t1.usr AND t2.type='')";

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}
	
	protected function app_addexa(){
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype))
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1 WHERE NOT EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.usr = t1.usr AND t2.type='{$this->_crudCmd->qparams->examtype}')";
		else
			$query='SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1 WHERE NOT EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.usr = t1.usr)';
		
		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_newexa(){
		if ($this->_crudCmd->payload && $this->_crudCmd->payload->userId && $this->_crudCmd->payload->examtype){
			$query="INSERT INTO exagrps (usr,type,parent) VALUES(:usr,:type,'')";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("type", $this->_crudCmd->payload->examtype);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_addexa();
	}

	protected function app_delexa(){
		// echo var_dump($this); exit(0);

		if ($this->_crudCmd->payload && $this->_crudCmd->payload->userId && $this->_crudCmd->payload->examtype){
			$db = getConn();

			try {
				$stmt = $db->prepare("DELETE exausr FROM exausr LEFT JOIN exagrps ON exagrps.id=exausr.idexa WHERE exagrps.usr=:usr AND exagrps.type=:examtype ");
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("examtype",$this->_crudCmd->payload->examtype);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	

			try {
				$stmt = $db->prepare("DELETE exacli FROM exacli LEFT JOIN exagrps ON exagrps.id=exacli.idexa WHERE exagrps.usr=:usr AND exagrps.type=:examtype ");
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("examtype",$this->_crudCmd->payload->examtype);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	

			try {
				$stmt = $db->prepare("DELETE FROM exagrps WHERE parent=:usr AND type=:examtype");
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("examtype",$this->_crudCmd->payload->examtype);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
			try {
				$stmt = $db->prepare("DELETE FROM exagrps WHERE usr=:usr AND type=:examtype");
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("examtype",$this->_crudCmd->payload->examtype);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_list();
	}

	protected function app_members(){
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype) && isset($this->_crudCmd->qparams->userId))
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1  INNER JOIN exagrps tx ON t1.usr=tx.usr WHERE tx.type='{$this->_crudCmd->qparams->examtype}' AND t1.usr<>'{$this->sanitize($this->_crudCmd->qparams->userId)}' AND EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.usr = t1.usr AND t2.parent='{$this->sanitize($this->_crudCmd->qparams->userId)}' AND t2.type='{$this->_crudCmd->qparams->examtype}')";
		else
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM exagrps AS t2 INNER JOIN users AS t1 ON t1.usr=t2.usr WHERE t2.usr='' ";

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		$this->sendData($query); exit(0);
	}

	protected function app_addmember(){
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype) && isset($this->_crudCmd->qparams->userId)) {
			$this->_crudCmd->qparams->examtype=substr($this->_crudCmd->qparams->examtype.'   ',0,3);
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1 INNER JOIN exagrps tx ON t1.usr=tx.usr ".
			"WHERE tx.type='{$this->_crudCmd->qparams->examtype}' AND t1.usr<>'{$this->sanitize($this->_crudCmd->qparams->userId)}' AND tx.parent='' ".
			"AND NOT EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.usr = t1.usr AND t2.parent='{$this->sanitize($this->_crudCmd->qparams->userId)}' AND t2.type='{$this->_crudCmd->qparams->userId}')";
		} else
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1 INNER JOIN exagrps tx ON t1.usr=tx.usr ".
			"WHERE tx.type='{$this->_crudCmd->qparams->examtype}' AND t1.usr<>'{$this->sanitize($this->_crudCmd->payload->userId)}' ".
			" AND NOT EXISTS(SELECT NULL FROM exagrps t2 WHERE t2.usr = t1.usr AND t2.parent='{$this->sanitize($this->_crudCmd->qparams->parentId)}' AND t2.type='{$this->_crudCmd->qparams->parentId}')";
		
		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_newmember(){
		if ($this->_crudCmd->payload && $this->_crudCmd->payload->userId && $this->_crudCmd->payload->examtype && $this->_crudCmd->qparams->parentId){
			$query="INSERT IGNORE INTO exagrps (usr,type,parent) VALUES(:usr,:type,:parent)";
			$this->_crudCmd->qparams->examtype=substr($this->_crudCmd->qparams->examtype.'   ',0,3);
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("type", $this->_crudCmd->payload->examtype);
				$stmt->bindParam("parent", $this->_crudCmd->qparams->parentId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->app_addmember();
	}

	protected function app_delmember(){
		// echo var_dump($this); exit(0);

		if ($this->_crudCmd->payload && $this->_crudCmd->payload->userId && $this->_crudCmd->qparams->clientId && $this->_crudCmd->qparams->examtype){
			$query="DELETE FROM exagrps WHERE usr=:usr AND type=:type AND parent=:parent";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("type", $this->_crudCmd->qparams->examtype);
				$stmt->bindParam("parent", $this->_crudCmd->qparams->clientId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->_crudCmd->qparams->userId=$this->_crudCmd->qparams->clientId;
		$this->app_members();
	}

	protected function app_users(){
		// echo var_dump($this); exit(0);
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype) && isset($this->_crudCmd->qparams->userId))
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users AS t1 WHERE EXISTS(SELECT NULL FROM exausr AS t2 INNER JOIN exagrps AS t3 ON t2.idexa=t3.id WHERE t1.usr=t2.usr AND t3.usr='{$this->sanitize($this->_crudCmd->qparams->userId)}' AND t3.type='{$this->_crudCmd->qparams->examtype}')";
		else
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM exagrps AS t2 INNER JOIN users AS t1 ON t1.usr=t2.usr WHERE t2.usr='' ";

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_adduser(){
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype) && isset($this->_crudCmd->qparams->userId))
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users AS t1 WHERE t1.usr<>'{$this->sanitize($this->_crudCmd->qparams->userId)}' AND NOT EXISTS(SELECT NULL FROM exausr AS t2 INNER JOIN exagrps AS t3 ON t2.idexa=t3.id WHERE t1.usr=t2.usr AND t3.usr='{$this->sanitize($this->_crudCmd->qparams->userId)}' AND t3.type='{$this->_crudCmd->qparams->examtype}')";
		else
			$query="SELECT t1.id,t1.usr,t1.firstname,t1.lastname,t1.phone,t1.mobile,t1.email FROM users t1 WHERE t1.usr='' ";
		
		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		$this->sendData($query); exit(0);
	}

	protected function app_newuser(){
		if ($this->_crudCmd->payload && $this->_crudCmd->payload->userId && $this->_crudCmd->payload->examtype && $this->_crudCmd->qparams->parentId){
			$query="INSERT INTO exausr (usr,idexa) SELECT :usr,id FROM exagrps WHERE usr=:parent AND type=:type";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("usr", $this->_crudCmd->payload->userId);
				$stmt->bindParam("type", $this->_crudCmd->payload->examtype);
				$stmt->bindParam("parent", $this->_crudCmd->qparams->parentId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
			$this->_crudCmd->qparams->userId = $this->_crudCmd->qparams->parentId;
			$this->app_adduser();
		}
	}

	protected function app_deluser(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->payload && $this->_crudCmd->payload->userId && $this->_crudCmd->qparams->clientId && $this->_crudCmd->qparams->examtype){
			$query="DELETE exausr FROM exausr LEFT JOIN exagrps ON exagrps.id=exausr.idexa WHERE exagrps.usr=:usr AND exagrps.type=:type AND exausr.usr=:userid";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("usr", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("type", $this->_crudCmd->qparams->examtype);
				$stmt->bindParam("userid", $this->_crudCmd->payload->userId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->_crudCmd->qparams->userId=$this->_crudCmd->qparams->clientId;
		$this->app_users();
	}


	protected function app_clients(){
		// echo var_dump($this); exit(0);
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype) && isset($this->_crudCmd->qparams->clientId))
			$query="SELECT t1.id,t1.code,t1.name,t1.ico,t1.icdph,t1.dic,t1.phone,t1.email FROM clients AS t1 WHERE EXISTS(SELECT NULL FROM exacli AS t2 INNER JOIN exagrps AS t3 ON t2.idexa=t3.id WHERE t1.id=t2.idcli AND t3.usr='{$this->sanitize($this->_crudCmd->qparams->clientId)}' AND t3.type='{$this->_crudCmd->qparams->examtype}')";
		else
			$query="SELECT t1.id,t1.code,t1.name,t1.ico,t1.icdph,t1.dic,t1.phone,t1.email FROM clients AS t1 WHERE t1.id=0 ";

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		// echo $query; exit(0);
		$this->sendData($query); exit(0);
	}

	protected function app_addclient(){
		if (isset($this->_crudCmd->qparams) && isset($this->_crudCmd->qparams->examtype) && isset($this->_crudCmd->qparams->clientId))
			$query="SELECT t1.id,t1.code,t1.name,t1.ico,t1.icdph,t1.dic,t1.phone,t1.email FROM clients AS t1 WHERE NOT EXISTS(SELECT NULL FROM exacli AS t2 INNER JOIN exagrps AS t3 ON t2.idexa=t3.id WHERE t1.id=t2.idcli AND t3.usr='{$this->sanitize($this->_crudCmd->qparams->clientId)}' AND t3.type='{$this->_crudCmd->qparams->examtype}')";
		else
		$query="SELECT t1.id,t1.code,t1.name,t1.ico,t1.icdph,t1.dic,t1.phone,t1.email FROM clients AS t1 WHERE t1.id=0 ";
		
		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		$this->sendData($query); exit(0);
	}

	protected function app_newclient(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->payload && $this->_crudCmd->payload->clientId && $this->_crudCmd->payload->examtype && $this->_crudCmd->payload->parentId){
			$query="INSERT INTO exacli (idcli,idexa) SELECT :idcli,id FROM exagrps WHERE usr=:parent AND type=:type";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("idcli", $this->_crudCmd->payload->clientId);
				$stmt->bindParam("type", $this->_crudCmd->payload->examtype);
				$stmt->bindParam("parent", $this->_crudCmd->payload->parentId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
			$this->_crudCmd->qparams->clientId = $this->_crudCmd->payload->parentId;
			$this->app_addclient();
		}
	}

	protected function app_delclient(){
		// echo var_dump($this); exit(0);
		if ($this->_crudCmd->payload && $this->_crudCmd->payload->clientId && $this->_crudCmd->qparams->clientId && $this->_crudCmd->qparams->examtype){
			$query="DELETE exacli FROM exacli LEFT JOIN exagrps ON exagrps.id=exacli.idexa WHERE exagrps.usr=:usr AND exagrps.type=:type AND exacli.idcli=:idcli";
			try {
				$db = getConn();
				$stmt = $db->prepare($query);
				$stmt->bindParam("usr", $this->_crudCmd->qparams->clientId);
				$stmt->bindParam("type", $this->_crudCmd->qparams->examtype);
				$stmt->bindParam("idcli", $this->_crudCmd->payload->clientId);
				$stmt->execute();
			} catch(PDOException $e) {
				$this->sendError($e);
			}	
		}
		$this->_crudCmd->qparams->clientId=$this->_crudCmd->qparams->clientId;
		$this->app_clients();
	}
}


class clsPicture extends clsTableData 
{
	public function __construct($args) {
		parent::__construct($args);
		$property='app_'.end($this->_args);
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_photo(){
		// echo var_dump($this); exit(0);
		$storage= new clsStorage(md5($this->_crudCmd->items->id));
		// echo $storage->userDir('picture');

		list($type, $data) = explode(';', $this->_crudCmd->items->data); 

		if (preg_match('/^data:image\/(\w+);base64,/', $this->_crudCmd->items->data, $type)) {
			$data = substr($data, strpos($data, ',') + 1);
			$type = strtolower($type[1]); // jpg, png, gif
	
			if (!in_array($type, array( 'jpg', 'jpeg', 'gif', 'png' ))) {
				throw new \Exception('invalid image type');
			}
	
			$data = base64_decode($data);
	
			if ($data === false) {
				throw new \Exception('base64_decode failed');
			}
		} else {
			throw new \Exception('did not match data URI with image data');
		}
	
		$fullname = $storage->userDir('picture').'photo.'.$type;
	
		if(file_put_contents($fullname, $data)){
			$result = $fullname;

			$fullname_parts = pathinfo($fullname);
			$filename = $fullname_parts['filename'];
			$extension = $fullname_parts['extension'];	
			$quality = 100;
			list($width, $height) = getimagesize($fullname);
			$width;
			$height;	
			$after_width = $after_height = 90;
			if ($width > $after_width) {


				// $reduced_width = ($width - $after_width);
				// $reduced_radio = round(($reduced_width / $width) * 100, 2);
				// $reduced_height = round(($height / 100) * $reduced_radio, 2);
				// $after_height = $height - $reduced_height;

				
				if ($extension == 'jpg' || $extension == 'jpeg' || $extension == 'JPG' || $extension == 'JPEG') {
					$img = imagecreatefromjpeg($fullname);
				} elseif ($extension == 'png' || $extension == 'PNG') {
					$img = imagecreatefrompng($fullname);
				} else {
					echo 'image extension is not supporting';
				}	
				// $imgResized = imagescale($img, $after_width, $after_height, $quality);
				
				if ($width>$height){
					$x0 = ($width-$height)/2;
					$y0 = 0;
					$width=$height;
				} else {
					$x0 = 0;
					$y0 = ($height-$width)/2;
					$height=$width;
				}
		
				$tempimage = imagecreatetruecolor($after_width, $after_height);
				imagecopyresampled($tempimage, $img, 0, 0, $x0, $y0, $after_width, $after_height, $width, $height);
				imagejpeg($tempimage,  $storage->userDir('picture').'thumb.jpeg');
				imagedestroy($img);
				imagedestroy($tempimage);
			}
	
		}
		unlink($fullname);
		return $result; 
		// $storage->deleteUserData();
		// echo $this->_crudCmd->items->data;
	}

	protected function app_delphoto(){
		$storage= new clsStorage(md5($this->_crudCmd->items->id));
		$filename=$storage->userDir('picture').'thumb.jpeg';
		if (file_exists($filename))	unlink($filename);
	}
}

class clsWebImage
{
	public function __construct($uid,$type,$name) {
		$property='app_'.$type;
		// echo $property; exit(0);
		try {
			$this->{$property}($uid,$name);
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_photo($uid,$name){
		$storage= new clsStorage($uid);
		$file_out =  $storage->userDir('picture').'thumb.jpeg';

		if (file_exists($file_out)) {
			$image_info = getimagesize($file_out);
			switch ($image_info[2]) {
				case IMAGETYPE_JPEG:
					header("Content-Type: image/jpeg");
					break;
				case IMAGETYPE_GIF:
					header("Content-Type: image/gif");
					break;
				case IMAGETYPE_PNG:
					header("Content-Type: image/png");
					break;
			   default:
					header($_SERVER["SERVER_PROTOCOL"] . " 500 Internal Server Error");
					break;
			}
			header('Content-Length: ' . filesize($file_out));
			readfile($file_out);
		
		}
		else { 
			header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
		}
	}
}

class clsUsrlngList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'usrlngs',
			'id,usr,lng,level,rtf',
			'id,usr,lng,level,rtf'
		);
		$this->route($this);
	}

	protected function read(){
		$query="SELECT ".$this->_fields." FROM ".$this->_filename." WHERE usr='".$this->sanitize($this->_crudCmd->qparams->userId)."'";
		$this->sendData($query); exit(0);
	}

	protected function update(){
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			if ($this->_id) $stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'usr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lng');
			$this->bindParam($stmt,$this->_crudCmd->payload,'level');
			$stmt->bindParam("rtf",$this->_crudCmd->payload->rtf, PDO::PARAM_INT);
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}
}

class clsUsrdocList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		// if ($cid){
		// 	$this->_cid=$id;
		// 	$this->_id=$cid;
		// } else {
		// 	$this->_cid=$id;
		// 	$this->_id='';
		// }
		// $this->loadPayloadData();

		$this->init(
			'usrdocs',
			'id,usr,type,name,comment,dafr,dato',
			'id,usr,type,name,comment,dafr,dato'
		);
		$this->route($this);
	}

	protected function read(){
		$query="SELECT ".$this->_fields." FROM ".$this->_filename." WHERE usr='".$this->sanitize($this->_crudCmd->qparams->userId)."'";
		$this->sendData($query); exit(0);
	}

	protected function update(){
		// echo var_dump($this); exit(0);
		// if (!$this->_id) $this->addSqlField('creator',$this->_currentUser);
		// echo var_dump($this->_crudCmd->payload); exit(0);
		$sql=$this->constructSql();
		// $this->sendError($sql);	exit;

		try {
			$db = getConn();
			$istmt = $db->prepare("INSERT IGNORE INTO ".$this->_filename." (id,usr) VALUES(:id,:usr)");
			$istmt->bindParam("id",$this->_id);
			$istmt->bindParam("usr",$this->_crudCmd->payload->usr);
			$istmt->execute();

			$stmt = $db->prepare($sql);
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'usr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'type');
			$this->bindParam($stmt,$this->_crudCmd->payload,'name');
			$this->bindParam($stmt,$this->_crudCmd->payload,'comment');
			$stmt->bindParam('dafr', $this->getDate($this->_crudCmd->payload->dafr));
			$stmt->bindParam('dato', $this->getDate($this->_crudCmd->payload->dato));

			// $stmt->bindParam('from', $this->_crudCmd->payload->from, PDO::PARAM_JSON);
			// $stmt->bindParam('to', $this->_crudCmd->payload->to, PDO::PARAM_JSON);
			// $stmt->bindParam("from",DateTime::createFromFormat('Y-m-d',$this->_crudCmd->payload->from));
			// $stmt->bindParam("to",DateTime::createFromFormat('Y-m-d',$this->_crudCmd->payload->to));
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}
}

class clsUsrDocument extends clsTableData 
{
	public function __construct($cid,$id) {
		if ($_SERVER['REQUEST_METHOD']=='OPTIONS') return;
		$this->loadPostData();
		if ($_SERVER['REQUEST_METHOD']=='POST'){ 
			$storage= new clsStorage(md5($this->_crudCmd->rowId));
			$filename = $storage->userDir('documents').$cid;	
			move_uploaded_file( $_FILES['filedata']['tmp_name'], $filename);
		} elseif ($_SERVER['REQUEST_METHOD']=='DELETE') {
			$storage= new clsStorage($cid);
			$filename = $storage->userDir('documents').$id;	
			// echo $filename;
			if ( file_exists($filename)) unlink($filename);
		}
	}
}

class clsExamDials extends clsTableData 
{
	public function __construct($cid='',$id='') {
		parent::__construct($cid,$id);
		// echo var_dump($this); exit(0);

		$property=$this->getCommndId();
		// echo $property; exit(0);
		try {
			$this->{$property}();
		}
		catch(Exception $e) {$this->sendError($e);}		
	}

	protected function app_places(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query='SELECT id,street,house_number,zip,city,state,latitude,longitude FROM addresses WHERE true';
		else
			$query='SELECT id,street,house_number,zip,city,state,latitude,longitude FROM addresses WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND ".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
		$this->sendData($query); exit(0);
	}

	protected function app_users(){
		if ($this->_crudCmd->qparams && $this->_crudCmd->qparams->clientId)
			$query=$this->getAvailUserQuery($this->_crudCmd->qparams->language,$this->_currentUser,$this->_crudCmd->qparams->field);
		else
			$query='SELECT id,usr,firstname,lastname FROM users t1 WHERE id=0';

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND t1.".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
	
// echo var_dump($query); exit(0);

		$this->sendData($query); exit(0);
	}

}

class clsExams extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'exams',
			'id,exatype,exnum,lng,state,stateview,idcomp,idfly,usetstnr,userecnr,usevidnr,planplace,idplanplace,planeddt,realplace,idrealplace,realdt,lpechngre,lprchngre,validto,invoice,payment,examlevel,examrec,ratrep,rectime,gencert',
			'id,exatype,exnum,lng,state,stateview,idcomp,idfly,usetstnr,userecnr,usevidnr,planplace,idplanplace,planeddt,realplace,idrealplace,realdt,lpechngre,lprchngre,validto,invoice,payment,examlevel,examrec,ratrep,rectime,gencert'
		);
		$this->route($this);
	}

	protected function read(){
		// echo var_dump($this->_crudCmd->qparams); exit(0);

		$this->_fields.=",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='applicant') as usr_applicant".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='assignedby') as usr_assignedby".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='lpeplaned') as usr_lpeplaned".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='lperespon') as usr_lperespon".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='lpereal') as usr_lpereal".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='lprplaned') as usr_lprplaned".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='lprrespon') as usr_lprrespon".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='lprreal') as usr_lprreal".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='appplaned') as usr_appplaned".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='apprespon') as usr_apprespon".
		",(SELECT CONCAT(`firstname`, ' ', `lastname`) FROM users u INNER JOIN exaass a ON u.usr=a.usr WHERE a.idexam=exams.id AND a.type='appreal') as usr_appreal".
		"";

		if (array_key_exists('qparams',$this->_crudCmd) && array_key_exists('exafilter',$this->_crudCmd->qparams)) {
			$where='';
			if ($this->_crudCmd->qparams->exafilter->typeexa || $this->_crudCmd->qparams->exafilter->typetra){
				$qfields=array();
				if ($this->_crudCmd->qparams->exafilter->typeexa) $qfields[]="exatype='exa' ";
				if ($this->_crudCmd->qparams->exafilter->typetra) $qfields[]="exatype='tra' ";
				if (!empty($qfields)) {
					$where.='('.implode(' OR ',$qfields).')';
				}
			}
			if ($this->_crudCmd->qparams->exafilter->typeact){
				$usrkey="(".$this->sanitize($this->_currentUser).")";
				if ($where) $where.=' AND ';
				$where.=("stateview LIKE '%".$usrkey."%'");
			} else {
				$userinfo=$this->getUserInfo();
				if ($userinfo->adm=='0'){
					$qfields=array();
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='applicant' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='assignedby' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='lpeplaned' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='lperespon' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='lpereal' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='lprplaned' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='lprrespon' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='lprreal' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='appplaned' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='apprespon' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					$qfields[]="EXISTS(SELECT 1 FROM exaass a WHERE a.idexam=exams.id AND a.type='appreal' AND a.usr='{$this->sanitize($this->_currentUser)}')";
					if ($where) $where.=" AND ";
					$where.='('.implode(' OR ',$qfields).')';
				}	
			}
			if ($where) $where="WHERE ".$where;
			$query="SELECT ".$this->_fields." FROM ".$this->_filename." ".$where;
		} else {
			$query="SELECT ".$this->_fields." FROM ".$this->_filename." WHERE false";		
		}

		// echo $query; exit(0);
			
		$this->sendData($query); exit(0);
	}

	public function lastNumber($type,$year){
		$last=0;
		try {
			$db = getConn();
			$stmt = $db->prepare("SELECT exalast FROM exacnts WHERE exatype=:exatype AND exayear=:exayear LIMIT 1");
			$stmt->bindParam("exatype", $type);
			$stmt->bindParam("exayear", $year);			
			$stmt->execute();
			$result = $stmt->fetch(PDO::FETCH_OBJ);
			if ($result){
				$last=intval($result->exalast)+1;
				$stmt = $db->prepare("UPDATE exacnts SET exalast=:exalast WHERE exatype=:exatype AND exayear=:exayear");
				$stmt->bindParam("exalast", $last);
				$stmt->bindParam("exatype", $type);
				$stmt->bindParam("exayear", $year);
				$stmt->execute();
			} else {
				$stmt = $db->prepare("INSERT INTO exacnts (exatype,exayear,exalast) VALUES (:exatype,:exayear,1)");
				$stmt->bindParam("exatype", $type);
				$stmt->bindParam("exayear", $year);			
				$stmt->execute();
				$last= 1;
			}
		} catch(PDOException $e) {
			// $this->sendError($e);
			return "";
		}
		return strtoupper(substr($type,0,1)).sprintf("%d%06d", date("Y"),$last);
	}

	protected function setExaass($idexam,$type,$usr){
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exaass WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $idexam);
			$stmt->bindParam("type", $type);
			$stmt->execute();
			if ($usr){
				$stmt = $db->prepare("INSERT INTO exaass (idexam,`type`,usr) VALUES(:idexam,:type,:usr)");
				$stmt->bindParam("idexam", $idexam);
				$stmt->bindParam("usr", $usr);
				$stmt->bindParam("type", $type);
				$stmt->execute();
			}
		} catch(PDOException $e) {}	
	}

	protected function setStateUsr($idexam,$state='',$rate=0){
		try {
			$db = getConn();
			$stmt = $db->prepare("SELECT `type`, usr FROM exaass WHERE idexam=:idexam");
			$stmt->bindParam("idexam", $idexam);
			$stmt->execute();
			$assusr=array(
				'lpeplaned'=>'',
				'lperespon'=>'',
				'lpereal'=>'',
				'lprplaned'=>'',
				'lprrespon'=>'',
				'lprreal'=>'',
				'appplaned'=>'',
				'apprespon'=>'',
				'appreal'=>'',
			);
			foreach ($stmt->fetchAll(PDO::FETCH_OBJ) as $eusr){
				$assusr[$eusr->type]="(".$eusr->usr.")";
			}
			$stmt = $db->prepare("SELECT `state`,lng FROM exams WHERE id=:idexam");
			$stmt->bindParam("idexam", $idexam);
			$stmt->execute();
			$exam = $stmt->fetch(PDO::FETCH_ASSOC);
			if (!$state){
				$state=$exam['state'];
			}

			$users=array();
			$users[$assusr["applicant"]]=$assusr["applicant"];
			$users[$assusr["assignedby"]]=$assusr["assignedby"];
			switch($state){
				case "e01a": 
					$users[$assusr["lpeplaned"]]=$assusr["lpeplaned"];
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					$this->setExaass($idexam,'lpereal','');
					break;
				case "e01b": 				
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					break;
				case "e02a": 
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					$users[$assusr["lpeplaned"]]=$assusr["lpeplaned"];
					break;
				case "e02b": 
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					$users[$assusr["lpeplaned"]]=$assusr["lpeplaned"];
					break;
				case "e02c": {
						$users[$assusr["lperespon"]]=$assusr["lperespon"];
						$users[$assusr["lpereal"]]=$assusr["lpereal"];

						$assusr["lprplaned"]=$this->geRandomUser($exam['lng'],"lpr");
						$this->setExaass($idexam,'lprplaned',$assusr["lprplaned"]);
						$users[$assusr["lprplaned"]]=$assusr["lprplaned"];

						$assusr["lprrespon"]=$this->getSeniorUsr('lprs',$assusr["lprplaned"]);
						$this->setExaass($idexam,'lprrespon',$assusr["lprrespon"]);
						$users[$assusr["lprrespon"]]=$assusr["lprrespon"];
						
						$this->setExaass($idexam,'lprplaned',$assusr["lprplaned"]);
						$this->setExaass($idexam,'lprrespon',$assusr["lprrespon"]);				

					} break;
				case "e02d":
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					$users[$assusr["lpereal"]]=$assusr["lpereal"];
					break;
				case "e03a": 
					$users[$assusr["lprrespon"]]=$assusr["lprrespon"];
					$users[$assusr["lprplaned"]]=$assusr["lprplaned"];
					break;
				case "e03b": {
						$users[$assusr["lprrespon"]]=$assusr["lprrespon"];
						$users[$assusr["lprreal"]]=$assusr["lprreal"];

						if ($rate<3){
							$assusr["appplaned"]=$this->geRandomUser($exam['lng'],"lpr",$assusr["lprreal"]);
							$this->setExaass($idexam,'lprplaned',$assusr["appplaned"]);
							$users[$assusr["appplaned"]]=$assusr["appplaned"];

							$assusr["apprespon"]=$this->getSeniorUsr('lprs',$assusr["appplaned"]);
							$this->setExaass($idexam,'lprrespon',$assusr["apprespon"]);
							$users[$assusr["apprespon"]]=$assusr["apprespon"];

							$this->setExaass($idexam,'appplaned',$assusr["appplaned"]);
							$this->setExaass($idexam,'apprespon',$assusr["apprespon"]);				
	
							try {
								$db = getConn();
								$stmt = $db->prepare("UPDATE exams SET state='e04a' WHERE id=:id");
								$stmt->bindParam("id",$this->_id);
								$stmt->execute();
							} catch(PDOException $e) { $this->sendError($e); };
						} else {
							// !!!
							$this->setExaass($idexam,'appplaned','');
							$this->setExaass($idexam,'appreal','');
							$this->setExaass($idexam,'apprespon','');				
							try {
								$db = getConn();
								$stmt = $db->prepare("UPDATE exams SET state='e01a' WHERE id=:id");
								$stmt->bindParam("id",$this->_id);
								$stmt->execute();
							} catch(PDOException $e) { $this->sendError($e); };
						}
					} break;
				case "e04a": 
					$users[$assusr["apprespon"]]=$assusr["apprespon"];
					$users[$assusr["appplaned"]]=$assusr["appplaned"];
					break;
				case "e04b": {
						$users[$assusr["apprespon"]]=$assusr["apprespon"];
						$users[$assusr["appreal"]]=$assusr["appreal"];
							
						// !!!
						if ($rate<3){
							try {
								$db = getConn();
								$stmt = $db->prepare("UPDATE exams SET state='e01a' WHERE id=:id");
								$stmt->bindParam("id",$this->_id);
								$stmt->execute();
							} catch(PDOException $e) { $this->sendError($e); };
						} else {
							try {
								$db = getConn();
								$stmt = $db->prepare("UPDATE exams SET state='e01a' WHERE id=:id");
								$stmt->bindParam("id",$this->_id);
								$stmt->execute();
							} catch(PDOException $e) { $this->sendError($e); };
						}
					} break;


				case "t01a": 
					$users[$assusr["lpeplaned"]]=$assusr["lpeplaned"];
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					$this->setExaass($idexam,'lpereal','');
					break;
				case "t01b": 				
					$users[$assusr["lperespon"]]=$assusr["lperespon"];
					break;
				case "t02a": {
						$users[$assusr["lperespon"]]=$assusr["lperespon"];
						$users[$assusr["lpereal"]]=$assusr["lpereal"];

						try {
							$db = getConn();
							$stmt = $db->prepare("UPDATE exams SET state='t01a' WHERE id=:id");
							$stmt->bindParam("id",$this->_id);
							$stmt->execute();
						} catch(PDOException $e) { $this->sendError($e); };


					} break;
			}
		
			$stmt = $db->prepare("UPDATE exams SET stateview=:stateview WHERE id=:id");
			$stmt->bindParam("stateview",implode($users));
			$stmt->bindParam("id",$this->_id);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		unset($this->_crudCmd->payload);
		$this->send1Data("SELECT `state`,stateview,".(strstr(implode($users), "(".$this->_currentUser.")")?1:0)." AS canview,EXISTS(SELECT 1 FROM exagrps WHERE usr='".$this->_currentUser."' AND type='adm') as adm FROM exams WHERE id='".$this->_id."'"); exit(0);
	}

	protected function setExadoc($idexam,$type,$name){
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exadocs WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $idexam);
			$stmt->bindParam("type", $type);
			$stmt->execute();

			$stmt = $db->prepare("INSERT INTO exadocs (idexam,`type`,name) VALUES(:idexam,:type,:name)");
			$stmt->bindParam("idexam", $idexam);
			$stmt->bindParam("name", $name);
			$stmt->bindParam("type", $type);
			$stmt->execute();
		} catch(PDOException $e) {}	
	}

	protected function newItem($type){
		$exnum=$this->lastNumber($type,(int)date('Y'));
		$state=$type[0].'01a';
		try {
			$db = getConn();
			$stmt = $db->prepare("INSERT INTO exams (exatype,exnum,state,idcomp,idfly) VALUES (:exatype,:exnum,:state,'1','1')");
			$stmt->bindParam("exatype",$type);
			$stmt->bindParam("exnum", $exnum);
			$stmt->bindParam("state", $state);
			$stmt->execute();
			$this->_id=$db->lastInsertId();
			$this->setExaass($this->_id,'assignedby',$this->_currentUser);
		} catch(PDOException $e) {
			// $this->sendError($e);
		}	
		$this->detail();
	}

	protected function newtest(){
		$idexam=$this->newItem('tra');
	}

	protected function newexam(){
		$idexam=$this->newItem('exa');
	}

	protected function detail(){
		$query='SELECT '.$this->_fieldsAll.' FROM '.$this->_filename .' WHERE id=\''.$this->_id.'\'';
		$record=array();
		$db = getConn();
		try {
			$stmt = $db->prepare($query);
			$stmt->execute();
			$record = $stmt->fetch(PDO::FETCH_ASSOC);
		} catch(PDOException $e) { $this->sendError(e); };

		foreach($db->query("SELECT e.usr,e.type,u.firstname,u.lastname,u.id AS faceid FROM exaass AS e INNER JOIN users u ON e.usr=u.usr WHERE e.idexam='".$this->_id."' ") as $row){
			$record[$row['type']]=array();
			$record[$row['type']]['usr']=$row['usr'];
			$record[$row['type']]['firstname']=$row['firstname'];
			$record[$row['type']]['lastname']=$row['lastname'];
			$record[$row['type']]['faceid']=$row['faceid'];
		};

		foreach($db->query("SELECT * FROM exaevls WHERE idexam='".$this->_id."' ") as $row){
			$record[$row['type'].'rat1']=$row['rat1'];
			$record[$row['type'].'com1']=$row['com1'];
			$record[$row['type'].'rat2']=$row['rat2'];
			$record[$row['type'].'com2']=$row['com2'];
			$record[$row['type'].'rat3']=$row['rat3'];
			$record[$row['type'].'com3']=$row['com3'];
			$record[$row['type'].'rat4']=$row['rat4'];
			$record[$row['type'].'com4']=$row['com4'];
			$record[$row['type'].'rat5']=$row['rat5'];
			$record[$row['type'].'com5']=$row['com5'];
		};

		foreach($db->query("SELECT * FROM exadocs WHERE idexam='".$this->_id."' ") as $row){
			$record[$row['type']]=$row['name'];
		};

		$record['examed_doc']=array();
		foreach($db->query("SELECT name FROM examed WHERE type='d' AND act ORDER BY name DESC") as $row){
			$record['examed_doc'][]=$row['name'];
		};
		$record['examed_aud']=array();
		foreach($db->query("SELECT name FROM examed WHERE type='a' AND act ORDER BY name DESC") as $row){
			$record['examed_aud'][]=$row['name'];
		};
		$record['examed_vid']=array();
		foreach($db->query("SELECT name FROM examed WHERE type='v' AND act ORDER BY name DESC") as $row){
			$record['examed_vid'][]=$row['name'];
		};

		$record['examed_usetstnr']=array('id'=>"",'filename'=>"");
		foreach($db->query("SELECT id,filename FROM examed WHERE type='d' AND name='".$this->sanitize($record['usetstnr'])."'") as $row){
			$record['examed_usetstnr']['id']=$row['id'];
			$record['examed_usetstnr']['filename']=$row['filename'];
		};
		$record['examed_userecnr']=array('id'=>"",'filename'=>"");
		foreach($db->query("SELECT id,filename FROM examed WHERE type='a' AND name='".$this->sanitize($record['userecnr'])."'") as $row){
			$record['examed_userecnr']['id']=$row['id'];
			$record['examed_userecnr']['filename']=$row['filename'];
		};
		$record['examed_usevidnr']=array('id'=>"",'filename'=>"");
		foreach($db->query("SELECT id,filename FROM examed WHERE type='v' AND name='".$this->sanitize($record['usevidnr'])."'") as $row){
			$record['examed_usevidnr']['id']=$row['id'];
			$record['examed_usevidnr']['filename']=$row['filename'];
		};

		$record['planplace']=array('id'=>$record['idplanplace'],'name'=>$record['planplace']);	
		unset($record['idplanplace']);
		$record['realplace']=array('id'=>$record['idrealplace'],'name'=>$record['realplace']);	
		unset($record['idrealplace']);

		foreach($db->query("SELECT name FROM flyoffices WHERE id='".$record['idfly']."' ") as $row){
			$record['flyoffice']=array();
			$record['flyoffice']['id']=$record['idfly'];
			$record['flyoffice']['name']=$row['name'];
		};
		unset($record['idfly']);


		$this->_crudCmd->items=$record;

		if (array_key_exists('uuid',$this->_crudCmd)){
			unset($this->_crudCmd->uuid);
		}
		if (array_key_exists('qparams',$this->_crudCmd)){
			unset($this->_crudCmd->qparams);
		}

		header('Content-Type: application/json');
		echo json_encode($this->_crudCmd);
	}

	protected function update(){
		// echo var_dump($this); exit(0);
		// if (!$this->_id) $this->addSqlField('creator',$this->_currentUser);
		// echo var_dump($this->_crudCmd->payload); exit(0);
		// $sql=$this->constructSql();
		// $this->sendError($sql);	exit;

		try {
			$db = getConn();
			$istmt = $db->prepare("INSERT IGNORE INTO ".$this->_filename." (id,usr) VALUES(:id,:usr)");
			$istmt->bindParam("id",$this->_id);
			$istmt->bindParam("usr",$this->_crudCmd->payload->usr);
			$istmt->execute();

			$stmt = $db->prepare($sql);
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'usr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'type');
			$this->bindParam($stmt,$this->_crudCmd->payload,'name');
			$this->bindParam($stmt,$this->_crudCmd->payload,'comment');
			$stmt->bindParam('dafr', $this->getDate($this->_crudCmd->payload->dafr));
			$stmt->bindParam('dato', $this->getDate($this->_crudCmd->payload->dato));

			// $stmt->bindParam('from', $this->_crudCmd->payload->from, PDO::PARAM_JSON);
			// $stmt->bindParam('to', $this->_crudCmd->payload->to, PDO::PARAM_JSON);
			// $stmt->bindParam("from",DateTime::createFromFormat('Y-m-d',$this->_crudCmd->payload->from));
			// $stmt->bindParam("to",DateTime::createFromFormat('Y-m-d',$this->_crudCmd->payload->to));
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}

	protected function delete(){
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM changelog WHERE idexam=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
			
			$stmt = $db->prepare("DELETE FROM exaass WHERE idexam=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();
			
			$stmt = $db->prepare("DELETE FROM exadocs WHERE idexam=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();

			$dicId=md5(str_pad((string)$this->_id, 10, "0", STR_PAD_LEFT));
			$storage= new clsStorage($dicId);
			$storage->deleteAppData();

			$stmt = $db->prepare("DELETE FROM exanots WHERE idexam=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();

			$stmt = $db->prepare("DELETE FROM exaevls WHERE idexam=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();

			$stmt = $db->prepare("DELETE FROM exams WHERE id=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();		
		} catch(PDOException $e) { $this->sendError($e); };

		$this->read();
	}

	protected function e01a(){
		$this->init('exams','id,lng,planplace,idplanplace,planeddt');
		$this->addSqlField('state','e01b');
		$sql=$this->constructSql();
		// $this->sendError($sql);	exit;
		// echo var_dump( $this); exit(0);

		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lng');
			$this->bindParam($stmt,$this->_crudCmd->payload,'planplace');
			$this->bindParam($stmt,$this->_crudCmd->payload,'idplanplace');
			$stmt->bindParam('planeddt', $this->getDatetime($this->_crudCmd->payload->planeddt));
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->setExaass($this->_id,'applicant',$this->_crudCmd->payload->applicant);

		$this->setExaass($this->_id,'lpeplaned',$this->_crudCmd->payload->lpeplaned);
		$userinfo=$this->getUserInfo();
		if ($userinfo->lpes=='0'){
			$this->setExaass($this->_id,'lperespon',$this->getSeniorUsr('lpes', $this->_crudCmd->payload->lpeplaned));
		} else {
			$this->setExaass($this->_id,'lperespon',$this->_crudCmd->payload->lpeplaned);
		}

		$this->setExaass($this->_id,'lprplaned','');
		$this->setExaass($this->_id,'lprreal','');
		$this->setExaass($this->_id,'lprrespon','');
		$this->setExaass($this->_id,'appplaned','');
		$this->setExaass($this->_id,'appreal','');
		$this->setExaass($this->_id,'apprespon','');				


		$this->setStateUsr($this->_id,'e01a');
	}

	protected function e01b(){
		$this->init('exams','id');
		$this->addSqlField('state','e02a');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->setStateUsr($this->_id,'e01b');
	}

	protected function e02a(){
		$this->init('exams','id,lpechngre,realplace,idrealplace,realdt');
		$this->addSqlField('state','e02b');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lpechngre');
			$this->bindParam($stmt,$this->_crudCmd->payload,'realplace');
			$this->bindParam($stmt,$this->_crudCmd->payload,'idrealplace');
			$stmt->bindParam('realdt', $this->getDatetime($this->_crudCmd->payload->realdt));
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setExaass($this->_id,'lpereal',$this->_crudCmd->payload->lpereal);
		$this->setStateUsr($this->_id,'e02a');
	}

	protected function e02b(){
		$this->init('exams','id,usetstnr,userecnr,usevidnr');
		$this->addSqlField('state','e02c');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'usetstnr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'userecnr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'usevidnr');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'e02b');
	}

	protected function e02c(){
		$this->init('exaevls','id,rate,rat1,com1,rat2,com2,rat3,com3,rat4,com4,rat5,com5');
		$this->addSqlField('idexam',$this->_id);
		$this->addSqlField('type','lpe');
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exaevls WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->execute();

			$stmt = $db->prepare($this->constructSql('insert'));
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->bindParam('rate', $this->_crudCmd->payload->lperate);
			$stmt->bindParam('rat1', $this->_crudCmd->payload->lperat1);
			$stmt->bindParam('com1', $this->_crudCmd->payload->lpecom1);
			$stmt->bindParam('rat2', $this->_crudCmd->payload->lperat2);
			$stmt->bindParam('com2', $this->_crudCmd->payload->lpecom2);
			$stmt->bindParam('rat3', $this->_crudCmd->payload->lperat3);
			$stmt->bindParam('com3', $this->_crudCmd->payload->lpecom3);
			$stmt->bindParam('rat4', $this->_crudCmd->payload->lperat4);
			$stmt->bindParam('com4', $this->_crudCmd->payload->lpecom4);
			$stmt->bindParam('rat5', $this->_crudCmd->payload->lperat5);
			$stmt->bindParam('com5', $this->_crudCmd->payload->lpecom5);
			$stmt->execute();

			$stmt = $db->prepare("UPDATE exams SET state='e02d' WHERE id=:id");
			$stmt->bindParam("id",$this->_id);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'e02c',$this->_crudCmd->payload->lperate);
	}
	
	protected function e02d(){
		$this->init('exams','id');
		$this->addSqlField('state','e03a');
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$stmt->execute();
			$this->setExadoc($this->_id,'testdoc',$this->_crudCmd->payload->testdoc);
			$this->setExadoc($this->_id,'testaudio',$this->_crudCmd->payload->testaudio);
			$this->setExadoc($this->_id,'testvideo',$this->_crudCmd->payload->testvideo);

		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'e02d');
	}

	protected function e03a(){
		$this->init('exams','id,lprchngre');
		$this->addSqlField('state','e03b');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lprchngre');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setExaass($this->_id,'lprreal',$this->_crudCmd->payload->lprreal);
		$this->setStateUsr($this->_id,'e03a');
	}

	protected function e03b(){
		$this->init('exaevls','id,rate,rat1,com1,rat2,com2,rat3,com3,rat4,com4,rat5,com5');
		$this->addSqlField('idexam',$this->_id);
		$this->addSqlField('type','lpr');
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exaevls WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->execute();

			$stmt = $db->prepare($this->constructSql('insert'));
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->bindParam('rate', $this->_crudCmd->payload->lprrate);
			$stmt->bindParam('rat1', $this->_crudCmd->payload->lprrat1);
			$stmt->bindParam('com1', $this->_crudCmd->payload->lprcom1);
			$stmt->bindParam('rat2', $this->_crudCmd->payload->lprrat2);
			$stmt->bindParam('com2', $this->_crudCmd->payload->lprcom2);
			$stmt->bindParam('rat3', $this->_crudCmd->payload->lprrat3);
			$stmt->bindParam('com3', $this->_crudCmd->payload->lprcom3);
			$stmt->bindParam('rat4', $this->_crudCmd->payload->lprrat4);
			$stmt->bindParam('com4', $this->_crudCmd->payload->lprcom4);
			$stmt->bindParam('rat5', $this->_crudCmd->payload->lprrat5);
			$stmt->bindParam('com5', $this->_crudCmd->payload->lprcom5);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'e03b',$this->_crudCmd->payload->lprrate);
	}

	protected function e04a(){
		$this->init('exams','id,appchngre');
		$this->addSqlField('state','e04b');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'appchngre');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setExaass($this->_id,'appreal',$this->_crudCmd->payload->appreal);
		$this->setStateUsr($this->_id,'e04a');
	}

	protected function e04b(){
		$this->init('exaevls','id,rate,rat1,com1,rat2,com2,rat3,com3,rat4,com4,rat5,com5');
		$this->addSqlField('idexam',$this->_id);
		$this->addSqlField('type','app');
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exaevls WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->execute();

			$stmt = $db->prepare($this->constructSql('insert'));
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->bindParam('rate', $this->_crudCmd->payload->apprate);
			$stmt->bindParam('rat1', $this->_crudCmd->payload->apprat1);
			$stmt->bindParam('com1', $this->_crudCmd->payload->appcom1);
			$stmt->bindParam('rat2', $this->_crudCmd->payload->apprat2);
			$stmt->bindParam('com2', $this->_crudCmd->payload->appcom2);
			$stmt->bindParam('rat3', $this->_crudCmd->payload->apprat3);
			$stmt->bindParam('com3', $this->_crudCmd->payload->appcom3);
			$stmt->bindParam('rat4', $this->_crudCmd->payload->apprat4);
			$stmt->bindParam('com4', $this->_crudCmd->payload->appcom4);
			$stmt->bindParam('rat5', $this->_crudCmd->payload->apprat5);
			$stmt->bindParam('com5', $this->_crudCmd->payload->appcom5);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'e04b',$this->_crudCmd->payload->apprate);
	}
	
	protected function t01a(){
		$this->init('exams','id,lng,flyingrules,planplace,idplanplace,planeddt');
		$this->addSqlField('state','t01b');
		$sql=$this->constructSql();
		// $this->sendError($sql);	exit;
		// echo var_dump( $this); exit(0);

		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lng');
			$this->bindParam($stmt,$this->_crudCmd->payload,'flyingrules');
			$this->bindParam($stmt,$this->_crudCmd->payload,'planplace');
			$this->bindParam($stmt,$this->_crudCmd->payload,'idplanplace');
			$stmt->bindParam('planeddt', $this->getDatetime($this->_crudCmd->payload->planeddt));
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->setExaass($this->_id,'applicant',$this->_crudCmd->payload->applicant);

		$this->setExaass($this->_id,'lpeplaned',$this->_crudCmd->payload->lpeplaned);
		$userinfo=$this->getUserInfo();
		if ($userinfo->lpes=='0'){
			$this->setExaass($this->_id,'lperespon',$this->getSeniorUsr('lpes', $this->_crudCmd->payload->lpeplaned));
		} else {
			$this->setExaass($this->_id,'lperespon',$this->_crudCmd->payload->lpeplaned);
		}

		$this->setExaass($this->_id,'lprplaned','');
		$this->setExaass($this->_id,'lprreal','');
		$this->setExaass($this->_id,'lprrespon','');
		$this->setExaass($this->_id,'appplaned','');
		$this->setExaass($this->_id,'appreal','');
		$this->setExaass($this->_id,'apprespon','');				


		$this->setStateUsr($this->_id,'t01a');
	}

	protected function t01b(){
		$this->init('exams','id');
		$this->addSqlField('state','t02a');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };

		$this->setStateUsr($this->_id,'t01b');
	}

	protected function t02a(){
		$this->init('exams','id,lpechngre,realplace,idrealplace,realdt');
		$this->addSqlField('state','t02b');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lpechngre');
			$this->bindParam($stmt,$this->_crudCmd->payload,'realplace');
			$this->bindParam($stmt,$this->_crudCmd->payload,'idrealplace');
			$stmt->bindParam('realdt', $this->getDatetime($this->_crudCmd->payload->realdt));
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setExaass($this->_id,'lpereal',$this->_crudCmd->payload->lpereal);
		$this->setStateUsr($this->_id,'t02a');
	}

	protected function t02b(){
		$this->init('exams','id,usetstnr,userecnr,usevidnr');
		$this->addSqlField('state','t02c');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'usetstnr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'userecnr');
			$this->bindParam($stmt,$this->_crudCmd->payload,'usevidnr');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'t02b');
	}

	protected function t02c(){
		$this->init('exaevls','id,rate,rat1,com1,rat2,com2,rat3,com3,rat4,com4,rat5,com5');
		$this->addSqlField('idexam',$this->_id);
		$this->addSqlField('type','lpe');
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exaevls WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->execute();

			$stmt = $db->prepare($this->constructSql('insert'));
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->bindParam('rate', $this->_crudCmd->payload->lperate);
			$stmt->bindParam('rat1', $this->_crudCmd->payload->lperat1);
			$stmt->bindParam('com1', $this->_crudCmd->payload->lpecom1);
			$stmt->bindParam('rat2', $this->_crudCmd->payload->lperat2);
			$stmt->bindParam('com2', $this->_crudCmd->payload->lpecom2);
			$stmt->bindParam('rat3', $this->_crudCmd->payload->lperat3);
			$stmt->bindParam('com3', $this->_crudCmd->payload->lpecom3);
			$stmt->bindParam('rat4', $this->_crudCmd->payload->lperat4);
			$stmt->bindParam('com4', $this->_crudCmd->payload->lpecom4);
			$stmt->bindParam('rat5', $this->_crudCmd->payload->lperat5);
			$stmt->bindParam('com5', $this->_crudCmd->payload->lpecom5);
			$stmt->execute();

			$stmt = $db->prepare("UPDATE exams SET state='t02d' WHERE id=:id");
			$stmt->bindParam("id",$this->_id);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'t02c',$this->_crudCmd->payload->lperate);
	}
	
	protected function t02d(){
		$this->init('exams','id');
		$this->addSqlField('state','t03a');
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$stmt->execute();
			$this->setExadoc($this->_id,'testdoc',$this->_crudCmd->payload->testdoc);
			$this->setExadoc($this->_id,'testaudio',$this->_crudCmd->payload->testaudio);
			$this->setExadoc($this->_id,'testvideo',$this->_crudCmd->payload->testvideo);

		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'t02d');
	}

	protected function t03a(){
		$this->init('exams','id,lprchngre');
		$this->addSqlField('state','t03b');
		$sql=$this->constructSql();
		try {
			$db = getConn();
			$stmt = $db->prepare($this->constructSql());
			$stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'state');
			$this->bindParam($stmt,$this->_crudCmd->payload,'lprchngre');
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setExaass($this->_id,'lprreal',$this->_crudCmd->payload->lprreal);
		$this->setStateUsr($this->_id,'t03a');
	}

	protected function t03b(){
		$this->init('exaevls','id,rate,rat1,com1,rat2,com2,rat3,com3,rat4,com4,rat5,com5');
		$this->addSqlField('idexam',$this->_id);
		$this->addSqlField('type','lpr');
		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM exaevls WHERE idexam=:idexam AND type=:type");
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->execute();

			$stmt = $db->prepare($this->constructSql('insert'));
			$stmt->bindParam("idexam", $this->_crudCmd->payload->idexam);
			$stmt->bindParam("type", $this->_crudCmd->payload->type);
			$stmt->bindParam('rate', $this->_crudCmd->payload->lprrate);
			$stmt->bindParam('rat1', $this->_crudCmd->payload->lprrat1);
			$stmt->bindParam('com1', $this->_crudCmd->payload->lprcom1);
			$stmt->bindParam('rat2', $this->_crudCmd->payload->lprrat2);
			$stmt->bindParam('com2', $this->_crudCmd->payload->lprcom2);
			$stmt->bindParam('rat3', $this->_crudCmd->payload->lprrat3);
			$stmt->bindParam('com3', $this->_crudCmd->payload->lprcom3);
			$stmt->bindParam('rat4', $this->_crudCmd->payload->lprrat4);
			$stmt->bindParam('com4', $this->_crudCmd->payload->lprcom4);
			$stmt->bindParam('rat5', $this->_crudCmd->payload->lprrat5);
			$stmt->bindParam('com5', $this->_crudCmd->payload->lprcom5);
			$stmt->execute();
		} catch(PDOException $e) { $this->sendError($e); };
		$this->setStateUsr($this->_id,'t03b',$this->_crudCmd->payload->lprrate);
	}

}


class clsAppDocument extends clsTableData 
{
	public function __construct($id,$cid,$name) {
		if ($_SERVER['REQUEST_METHOD']=='OPTIONS') return;
		$this->loadPostData(false);
		if ($_SERVER['REQUEST_METHOD']=='GET'){ 
			$storage= new clsStorage($id);
			$filename =  $storage->appDir().$cid;

			if (file_exists($filename)) {
				// echo $filename; exit;

				if(preg_match("/\.jpg|\.gif|\.png|\.jpeg/i", $name)){
					header("Content-Type: ".mime_content_type($name));
				}
				elseif(preg_match("/\.pdf/i", $name)){
					header("Content-Type: application/force-download");
					header("Content-type: application/pdf");
					header("Content-Disposition: inline; filename=\"".$name."\"");
					header('Content-Transfer-Encoding: binary');
					header('Accept-Ranges: bytes');
				}	
				else{
					header("Content-Type: application/force-download");
					header("Content-type: application/octet-stream");
					header("Content-Disposition: attachment; filename=\"".$name."\";");
				}
				header('Content-Length: ' . filesize($filename));
				@readfile($filename);
			}
		} elseif ($_SERVER['REQUEST_METHOD']=='POST'){ 
			$storage= new clsStorage($id);
			$filename = $storage->appDir().$this->_crudCmd->type;	
			move_uploaded_file( $_FILES['filedata']['tmp_name'], $filename);
		} elseif ($_SERVER['REQUEST_METHOD']=='DELETE') {
			$storage= new clsStorage($id);
			$filename = $storage->appDir().$this->_crudCmd->type;	
			if ( file_exists($filename)) unlink($filename);
		}
	}

}

class clsExamedList extends clsTableData 
{
	public function __construct($cid,$id) {
		parent::__construct($cid,$id);
		$this->init(
			'examed',
			'id,type,name,filename,act',
			'id,type,name,filename,act'
		);
		if ($_SERVER['REQUEST_METHOD']=='POST' && $this->_cid=='' && $this->_id==''){ 
			// echo var_dump($this->_crudCmd->items->type); exit(0);
			try {
				$db = getConn();
				$stmt = $db->prepare("INSERT INTO examed (type,name) VALUES(:type,'')");
				$stmt->bindParam("type",$this->_crudCmd->items->type);
				$stmt->execute();
				$this->_id=$db->lastInsertId();
			} catch(PDOException $e) { $this->sendError($e); };
		}	
		$this->route($this);
	}

	protected function read(){
		// echo var_dump($this->_crudCmd->qparams); exit(0);
		if (array_key_exists('qparams',$this->_crudCmd) && array_key_exists('type',$this->_crudCmd->qparams))
			$query="SELECT ".$this->_fields." FROM ".$this->_filename." WHERE type='".$this->sanitize($this->_crudCmd->qparams->type)."'";
		else
			$query="SELECT ".$this->_fields." FROM ".$this->_filename." WHERE true";

		if (array_key_exists('brwFieldName',$this->_crudCmd) && array_key_exists('brwFieldValue',$this->_crudCmd) && $this->_crudCmd->brwFieldValue!==""){
			$query=$query . " AND ".$this->_crudCmd->brwFieldName." LIKE '%".$this->sanitize($this->_crudCmd->brwFieldValue)."%'";
		}
		$query.=" ORDER BY type,name";
		$this->sendData($query); exit(0);
	}

	protected function update(){
		$this->addSqlField('fullsearch',
			$this->_crudCmd->payload->name.", ".
			$this->_crudCmd->payload->filename.""
		);
		$sql=$this->constructSql();

		try {
			$db = getConn();
			$stmt = $db->prepare($sql);
			if ($this->_id) $stmt->bindParam("id",$this->_id);
			$this->bindParam($stmt,$this->_crudCmd->payload,'fullsearch');
			$this->bindParam($stmt,$this->_crudCmd->payload,'type');
			$this->bindParam($stmt,$this->_crudCmd->payload,'name');
			$this->bindParam($stmt,$this->_crudCmd->payload,'filename');
			$stmt->bindParam("act",$this->_crudCmd->payload->act, PDO::PARAM_INT);
			$stmt->execute();
			if (!$this->_id) $this->_id=$db->lastInsertId();
		} catch(PDOException $e) { $this->sendError($e); };
	}

	protected function delete(){
		try {
			$dicId=md5('MD'.str_pad((string)$this->_id, 10, "0", STR_PAD_LEFT));
			$storage= new clsStorage($dicId);
			$storage->deleteAppData();
		} catch(PDOException $e) { };


		try {
			$db = getConn();
			$stmt = $db->prepare("DELETE FROM examed WHERE id=:id");
			$stmt->bindParam("id", $this->_id);
			$stmt->execute();		
		} catch(PDOException $e) { return $this->sendError($e); };

		// $this->read();
	}

}



?>
