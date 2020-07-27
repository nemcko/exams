<?php

class clsValidators
{
	protected $_oid;
	protected $_field;
	protected $_value;

	public function __construct($oid,$field,$value) {
		$this->_oid=$oid;
		$this->_field=$field;
		$this->_value=$value;
		$this->sendData();
	}

	public function constructSql() {
		$sql='';
		$key=$this->_oid;
		if ($this->_field) $key.='_'.$this->_field;
		switch ($key){
			case 'address': $sql="SELECT 1 FROM users WHERE usr=:value";break;
			case 'isaddress': $sql="SELECT 1 FROM addresses";break;
			// case 'address': $sql="SELECT 1 FROM addresses WHERE address=:value";break;
			case 'address_id': $sql="SELECT 1 FROM addresses WHERE id=:id";break;
		}
		return $sql;
	}

	public function sendData(){
		$sql=$this->constructSql();
		$query = "SELECT EXISTS($sql) AS valid";
		// echo var_dump($query); exit(0);
		// echo var_dump($this); exit(0);

		try {
			$db = getConn();
			$stmt = $db->prepare($query);
			if ($this->_field)	
				$stmt->bindParam($this->_field, $this->_value);
			elseif ($this->_value)	
				$stmt->bindParam(':value', $this->_value);
			$stmt->execute();
			$ret = $stmt->fetch(PDO::FETCH_ASSOC);
		} catch(PDOException $e) {
			header('HTTP/1.1 500 Application error');
			echo json_encode(array('error' => $this->friendlyName($e->getMessage())));
			exit(0);
		}
		if ($ret['valid']=='1'){
			header('HTTP/1.1 200 Object validated');
			echo '"true"';
			exit(0);
		} else {
			header('HTTP/1.1 404 Object not found');
			echo 'Object not found';
			exit(0);
		}
	}

}
?>