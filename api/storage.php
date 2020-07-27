<?php

class clsStorage 
{
	protected $_storageid;

	public function __construct($uid) {
		$this->_storageid=$uid;
	}

	// public function appDir(){
	// 	return dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR;
	// }

	public function userDir($subdir=''){
		$dir=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'api'.DIRECTORY_SEPARATOR.'stguser'.DIRECTORY_SEPARATOR;
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
		$dir.=$this->_storageid.DIRECTORY_SEPARATOR;
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
		if ($subdir){
			$dir.=$subdir.DIRECTORY_SEPARATOR;
		}
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
		return $dir;
	}

	public function deleteUserData(){
		$dir=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'api'.DIRECTORY_SEPARATOR.'stguser'.DIRECTORY_SEPARATOR.$this->_storageid.DIRECTORY_SEPARATOR;
		$this->destroy_dir($dir);
	}

	protected function getUserTempFile($filename){
		$dir=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR .'temp'.DIRECTORY_SEPARATOR.'stguser'.DIRECTORY_SEPARATOR.$this->$_storageid;
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
// 		echo $dir.DIRECTORY_SEPARATOR .$filename;exit(0);
		return $dir.DIRECTORY_SEPARATOR .$filename;
	}

	protected function rrmdir($path) {
		$i = new DirectoryIterator($path);
		foreach($i as $f) {
			if($f->isFile()) {
				unlink($f->getRealPath());
			} else if(!$f->isDot() && $f->isDir()) {
				$this->rrmdir($f->getRealPath());
			}
		}
		rmdir($path);
	}

	protected function destroy_dir($dir) {
		if (is_dir ( $dir ) )
			$this->rrmdir($dir);

		// if (is_link ( $dir )) {
		// 	return unlink ( $dir );
		// }

	
		// if (! is_dir ( $dir ) ) {
		// 	return;
		// }
		// foreach ( scandir ( $dir ) as $file ) {
		// 	if ($file == '.' || $file == '..')
		// 		continue;
		// 	if (! $this->destroy_dir ( $dir . DIRECTORY_SEPARATOR . $file )) {
		// 		chmod ( $dir . DIRECTORY_SEPARATOR . $file, 0777 );
		// 		if (! $this->destroy_dir ( $dir . DIRECTORY_SEPARATOR . $file ))
		// 			return false;
		// 	}
		// }
		// return rmdir ( $dir );
	}
	

	public function getEnUrl($string){
		$hex = '';
		for($i = 0; $i < strlen ( $string ); $i ++) {
			$ord = ord ( $string [$i] );
			$hexCode = dechex ( $ord );
			$hex .= substr ( '0' . $hexCode, - 2 );
		}
		return strToUpper ( $hex );
	}

	public function getDeUrl($hex){
		if ( ctype_xdigit($hex) ){
			$string = '';
			for($i = 0; $i < strlen ( $hex ) - 1; $i += 2) {
				$string .= chr ( hexdec ( $hex [$i] . $hex [$i + 1] ) );
			}
			return $string;
		} else 
			return $hex;
	}
	
	public function friendlyName($name) {
		$name = preg_replace('~[^\\pL0-9_]+~u', '-', $name);
		$name = trim($name, "-");
		$name = iconv("utf-8", "us-ascii//TRANSLIT", $name);
		$name = strToLower($name);
		$name = preg_replace('~[^-a-z0-9_]+~', '', $name);
		return $name;
	}


	public function appDir($subdir=''){
		$dir=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'api'.DIRECTORY_SEPARATOR.'stgapp'.DIRECTORY_SEPARATOR;
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
		$dir.=$this->_storageid.DIRECTORY_SEPARATOR;
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
		if ($subdir){
			$dir.=$subdir.DIRECTORY_SEPARATOR;
		}
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
		return $dir;
	}

	public function deleteAppData(){
		$dir=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'api'.DIRECTORY_SEPARATOR.'stgapp'.DIRECTORY_SEPARATOR.$this->_storageid.DIRECTORY_SEPARATOR;
		$this->destroy_dir($dir);
	}
	
	protected function getAppTempFile($filename){
		$dir=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR .'temp'.DIRECTORY_SEPARATOR.'stgapp'.DIRECTORY_SEPARATOR.$this->$_storageid;
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0705);
		}
// 		echo $dir.DIRECTORY_SEPARATOR .$filename;exit(0);
		return $dir.DIRECTORY_SEPARATOR .$filename;
	}


}
?>
