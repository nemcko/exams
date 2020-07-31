<?php
require_once 'db.php';

class clsPicture
{
	protected $_image=null;
	protected $_image_type;
	protected $_image_width;
	protected $_image_height;
	protected $_image_string;
	protected $_image_name;
	protected $_image_quality=100;
	protected $_truecolorimage;
	protected $_pixel_size=10;

	public function __construct() {
		ini_set('max_execution_time', 0);
		ini_set('memory_limit', '5G');
	}
	
	
	public function savePicture($name){
		$imagefile=basename($name);
		$imagename=pathinfo(basename($imagefile, '.'.pathinfo($imagefile, PATHINFO_EXTENSION)), PATHINFO_FILENAME);
		$imagename=friendlyName($imagename).'.png';
		$filename='../img/loaded/'.$imagefile;
		$dir='../img/loaded';
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0604);
		}
		$dir='../img/small';
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0604);
		}
		$dir='../img/nail';
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0604);
		}
		
		$dir='../img/medium';
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0604);
		}
		
		$dir='../img/normal';
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0604);
		}
// 		$dir='../img/svg';
// 		if (!is_dir($dir)) {
// 			mkdir($dir);
// 			chmod($dir,0604);
// 		}
		$dir='../img/large';
		if (!is_dir($dir)) {
			mkdir($dir);
			chmod($dir,0604);
		}
		
		$f = fopen($filename, "w");
		if ($f) {
			fwrite($f, $GLOBALS["HTTP_RAW_POST_DATA"]);
			fclose($f);
			@chmod($filename,0604);
			$this->loadImage($filename,$imagename);
			$this->getImage(40,30, '../img/small/'.$imagename);

// 			$this->makeNailimage('../img/small/'.$imagename,'../img/nail/'.$imagename);
			$this->loadImage($filename,$imagename);
			$this->getImage(40,30, '../img/nail/'.$imagename,false,'4,-100|2');
			
			//'2|4,10|6|5,85,85,85'
			
			$this->loadImage($filename,$imagename);
			$this->getImage(120,90, '../img/medium/'.$imagename);
				
			$this->loadImage($filename,$imagename);			
			$this->getImage(320,180, '../img/normal/'.$imagename);
			
// 			$this->saveSVG(320,180,$filename,'../img/svg/'.str_replace('.png','.svg',$imagename));
			
			$this->loadImage($filename,$imagename);
			$this->getImage(800,450, '../img/large/'.$imagename);
			
			try {
				$db = getConn();
				$stmt = $db->prepare("SELECT (SELECT id FROM media WHERE filename=:imagefile) AS id");
				$stmt->bindParam("imagefile", $imagename);
				$stmt->execute();
				$result = $stmt->fetch(PDO::FETCH_OBJ);
				if ($result->id==0){
					$stmt = $db->prepare("INSERT INTO media (filename) VALUES (:imagefile)");
					$stmt->bindParam("imagefile", $imagename);
					$stmt->execute();
					$result->id=$db->lastInsertId();
				}
				return $result->id;
			} catch(PDOException $e) {
				return null;
			}
		}
		return null;
	}

	function loadImage($filename,$name='') {
		$image_info = getimagesize($filename);
		if ( $name ) {
			$this->_img_name = $name;
		} else {
			$this->_img_name = $filename;
		}
		$this->_img_width = $image_info[0];
		$this->_img_height = $image_info[1];
		$this->_image_type = $image_info[2];
		$this->_image_quality = 100;
		unset($this->_image);
	
		if( $this->_image_type == IMAGETYPE_JPEG ) {
			$this->_image = imagecreatefromjpeg($filename);
		} elseif( $this->_image_type == IMAGETYPE_GIF ) {
			$this->_image = imagecreatefromgif($filename);
		} elseif( $this->_image_type == IMAGETYPE_PNG ) {
			$this->_image = imagecreatefrompng($filename);
		}
	}
	
	public function getImage($width,$height,$filename,$logo=false,$filter=null) {
/*
		$new_image = imagecreatetruecolor($width, $height);
		if ($filter)
			$color = imagecolorallocate($new_image, 255, 255, 255);
		else
			$color = imagecolorallocate($new_image, 0, 255, 255);
		imagefilledrectangle($new_image, 0, 0, $width, $height, $color);
		imagecolortransparent($new_image, $color);
	
		$ratio1=$this->_img_width/$this->_img_height;
		$ratio2=$width/$height;
	
		$x=0;
		$y=0;
		$imgwidth=$width;
		$imgheight=$height;
	
		if ( $ratio2>=1 ) {
			if ( $ratio1>=1 ) {
				$imgheight=$height;
				$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				if ( $imgwidth>$width )
				{
					$imgwidth=$width;
					$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				}
			} else {
				$imgwidth=$width;
				$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				if ( $imgheight>$height )
				{
					$imgheight=$height;
					$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				}
			}
		} else {
			if ( $ratio1>=1 ) {
				$imgheight=$height;
				$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				if ( $imgwidth>$width )
				{
					$imgwidth=$width;
					$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				}
			} else {
				$imgwidth=$width;
				$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				if ( $imgheight>$height )
				{
					$imgheight=$height;
					$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				}
			}
		}
	
// 		$x=($width-$imgwidth)/2;
// 		$y=($height-$imgheight)/2;

// 		imagecopyresampled($new_image, $this->_image, $x, $y, 0, 0, $imgwidth, $imgheight, $this->_img_width, $this->_img_height);
		imagecopyresampled($new_image, $this->_image, 0, 0, 0, 0, $imgwidth, $imgheight, $this->_img_width, $this->_img_height);
*/
		$source_aspect_ratio = $this->_img_width / $this->_img_height;
		$desired_aspect_ratio = $width / $height;
		
		if ($source_aspect_ratio > $desired_aspect_ratio) {
			$temp_height = $height;
			$temp_width = ( int ) ($height * $source_aspect_ratio);
		} else {
			$temp_width = $width;
			$temp_height = ( int ) ($width / $source_aspect_ratio);
		}
		$tempimage = imagecreatetruecolor($temp_width, $temp_height);
		imagecopyresampled($tempimage,$this->_image,0, 0,0, 0,$temp_width, $temp_height,$this->_img_width, $this->_img_height);
		
		$x0 = ($temp_width - $width) / 2;
		$y0 = ($temp_height - $height) / 2;
		
		$new_image = imagecreatetruecolor($width, $height);
		if ($filter)
			$color = imagecolorallocate($new_image, 255, 255, 255);
		else
			$color = imagecolorallocate($new_image, 0, 255, 255);
		imagefilledrectangle($new_image, 0, 0, $width, $height, $color);
		imagecolortransparent($new_image, $color);
		
		imagecopy($new_image,$tempimage,0, 0,$x0, $y0,$width, $height);		
		imagedestroy($tempimage);
		
		$this->_img_width = $width;
		$this->_img_height = $height;
		$this->_image_type = IMAGETYPE_PNG;
		$this->_image = $new_image;
	
		if ( $filter ) {
			$this->filter($filter);
		}
	
	
	
		if ( $filename ) {
			imagepng($this->_image,$filename);
			chmod($filename,0604);
		} else {
			imagepng($this->_image);
		}
	}
	
	function filter($filters)
	{
		$imageFilters = array (
				1 => array (IMG_FILTER_NEGATE, 0),
				2 => array (IMG_FILTER_GRAYSCALE, 0),
				3 => array (IMG_FILTER_BRIGHTNESS, 1),
				4 => array (IMG_FILTER_CONTRAST, 1),
				5 => array (IMG_FILTER_COLORIZE, 4),
				6 => array (IMG_FILTER_EDGEDETECT, 0),
				7 => array (IMG_FILTER_EMBOSS, 0),
				8 => array (IMG_FILTER_GAUSSIAN_BLUR, 0),
				9 => array (IMG_FILTER_SELECTIVE_BLUR, 0),
				10 => array (IMG_FILTER_MEAN_REMOVAL, 0),
				11 => array (IMG_FILTER_SMOOTH, 0),
				12 => array (IMG_FILTER_PIXELATE, 2),
		);
			
			
		$filterList = explode ('|', $filters);
		foreach ($filterList as $fl) {
	
			$filterSettings = explode (',', $fl);
			if (isset ($imageFilters[$filterSettings[0]])) {
	
				for ($i = 0; $i < 4; $i ++) {
					if (!isset ($filterSettings[$i])) {
						$filterSettings[$i] = null;
					} else {
						$filterSettings[$i] = (int) $filterSettings[$i];
					}
				}
	
				switch ($imageFilters[$filterSettings[0]][1]) {
	
					case 1:
	
						imagefilter ($this->_image, $imageFilters[$filterSettings[0]][0], $filterSettings[1]);
						break;
	
					case 2:
	
						imagefilter ($this->_image, $imageFilters[$filterSettings[0]][0], $filterSettings[1], $filterSettings[2]);
						break;
	
					case 3:
	
						imagefilter ($this->_image, $imageFilters[$filterSettings[0]][0], $filterSettings[1], $filterSettings[2], $filterSettings[3]);
						break;
	
					case 4:
	
						imagefilter ($this->_image, $imageFilters[$filterSettings[0]][0], $filterSettings[1], $filterSettings[2], $filterSettings[3], $filterSettings[4]);
						break;
	
					default:
	
						imagefilter ($this->_image, $imageFilters[$filterSettings[0]][0]);
						break;
	
				}
			}
		}
	
	}
	

	public function showImage($id,$type){
		try {
			$db = getConn();
			$stmt = $db->prepare("SELECT filename FROM media WHERE id=:id");
			$stmt->bindParam("id", $id);
			$stmt->execute();
			$result = $stmt->fetch(PDO::FETCH_OBJ);
			$db = null;
			if ($result->filename){
				if ($type=='svg'){
					$filename='../img/'.$type.'/'.str_replace('.png','.svg',$result->filename);
					if ( file_exists($filename)  ){
						echo file_get_contents($filename);
					}
				} else {
					$filename='../img/'.$type.'/'.$result->filename;
					if ( file_exists($filename)  ){
						echo file_get_contents($filename);
					}
				}
			}

		} catch(PDOException $e) {};
		exit(0);						exit(0);
	}
	
	
	public function saveSVG($width, $height, $filename ,$svgfile ) {
		$new_image = imagecreatetruecolor($width, $height);
		$color = imagecolorallocate($new_image, 0, 255, 255);
		imagefilledrectangle($new_image, 0, 0, $width, $height, $color);
		imagecolortransparent($new_image, $color);
		
		$this->loadImage($filename);
		
		$ratio1=$this->_img_width/$this->_img_height;
		$ratio2=$width/$height;
		
		$x=0;
		$y=0;
		$imgwidth=$width;
		$imgheight=$height;
		
		if ( $ratio2>=1 ) {
			if ( $ratio1>=1 ) {
				$imgheight=$height;
				$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				if ( $imgwidth>$width )
				{
					$imgwidth=$width;
					$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				}
			} else {
				$imgwidth=$width;
				$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				if ( $imgheight>$height )
				{
					$imgheight=$height;
					$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				}
			}
		} else {
			if ( $ratio1>=1 ) {
				$imgheight=$height;
				$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				if ( $imgwidth>$width )
				{
					$imgwidth=$width;
					$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				}
			} else {
				$imgwidth=$width;
				$imgheight=round($this->_img_height*$imgwidth/$this->_img_width,0);
				if ( $imgheight>$height )
				{
					$imgheight=$height;
					$imgwidth=round($this->_img_width*$imgheight/$this->_img_height,0);
				}
			}
		}
		
		$x=($width-$imgwidth)/2;
		$y=($height-$imgheight)/2;
		
		imagecopyresampled($new_image, $this->_image, 0, 0, $x, $y, $imgwidth, $imgheight, $this->_img_width, $this->_img_height);
				
		$this->_img_width = $imgwidth;
		$this->_img_height = $imgheight;
		$this->_image_type = IMAGETYPE_PNG;
		$this->_image = $new_image;
		
		$rms=12;
		$sizeLowLimit=2;
		$w = $this->_img_width;
		$h = $this->_img_height;
		$mainRect = array( 0, 0, $w, $h);
		$mainArray = Array();
		
		$this->_truecolorimage = imagecreatetruecolor ( $this->_img_width, $this->_img_height );
		imagecopyresampled ( $this->_truecolorimage, $this->_image, 0, 0, 0, 0, $this->_img_width, $this->_img_height, $this->_img_width, $this->_img_height );
		
		$this->rmserr = $rms;
		$this->wthreshold = $this->hthreshold = $sizeLowLimit;
	
		$this->quadRecurse( $mainArray, $mainRect );  // *** RECURSE ***
	
// 		echo var_dump($this->_img_width*$this->_img_height);
// 		echo var_dump(count($mainArray));
		
		$f = fopen($svgfile, "w");
		if ($f) {
			fwrite($f, $this->getSvgData( $mainArray));
			fclose($f);
			@chmod($filename,0604);
		}
	}
	
	private function getSvgData( &$ar ) {
		$r = null;
		$pixels = null;
		$awt = null;
		$color = null;
/*
		$output =
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>' ."\n".
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" ' .
		'"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">'.
		'<svg xmlns="http://www.w3.org/2000/svg" ' .
		'xmlns:xlink="http://www.w3.org/1999/xlink" ' .
		'viewBox="0 0 '.$this->_img_width.' '.$this->_img_height.'" ' .
		'xml:space="preserve" ' .
		'width="'.$this->_img_width.'px" ' .
		'height="'.$this->_img_height.'px">' .
		'<g transform="scale(.85)">';
*/
  		$output = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" width="'.($this->_img_width).'" height="'.($this->_img_height).'" xml:space="preserve" preserveAspectRatio="xMidYMin slice" viewBox="0 0 '.($this->_img_width).' '.($this->_img_height).'" >';
  		$output.= "\n<g transform=\"scale(.85)\">";
	
		for ($i = 0, $r = null; $i < count($ar); $i++) {
			$r = $ar[$i];
			$pixels = $this->getPixArrayFromRect($r);
			$awt = $this->getAverageAWTColor( $pixels );
	
			$color = $this->awtColorToHex( $awt );
			// 	echo var_dump($r);
			$output .= $this->outputSVGRect( $r, $this->intToHex($color) );
		}
		$output .= "</g>";
		$output .= "\n</svg>";
		return $output;
	}
	
	private function getCG(&$pix, $w) {
		$intensity = 0;
		$red = 0;
		$green = 0;
		$blue = 0;
		$cg = array( 0, 0);
		$averageIntensity = 0;
		$pvalue = 0;
	
		for ($i = 0; $i < count($pix); $i++ ) {
			$pvalue = $pix[$i];
			$red = (($pvalue >> 16) & 0xFF);
			$green = (($pvalue >> 8) & 0xFF);
			$blue = $pvalue & 0xFF;
			$intensity = ($red + $blue + 2 * $green)/1024;
			$averageIntensity += $intensity;
			$cg[0] += $intensity * ($i % $w);
			$cg[1] += $intensity * ($i / $w);
		}
	
		$cg[0] /= $averageIntensity;
		$cg[1] /= $averageIntensity;
	
		$cg[0] /= $w;
		$cg[1] /= count($pix)/$w;
		return $cg;
	}
	private function getRMSError(  $pix ) {
	
		$accumulator = 0;
		$diff = 0;
		$aveIntensity = 0;
		$rms = 0;
		$len = count($pix);
	
		for ($i = 0; $i < $len; $i++) {
			$aveIntensity += (($pix[$i] >> 8) & 0xFF);
		}
	
		$aveIntensity /= $len;
	
		for ($i = 0; $i < $len; $i++) {
			$diff = (($pix[$i] >> 8) & 0xFF) - $aveIntensity;
			$accumulator += $diff * $diff;
		}
	
		$rms = $accumulator/$len;
	
		return sqrt($rms);
	}
	
	
	private function quadRecurse( &$ar, &$rect ) {
	
		if ( !$this->isDivisible( $rect ) ) {
			$ar[] = $rect;
			return;
		}
	
		$newRects = $this->quadDivide( $rect ); // partition rect
	
		for ($i = 0; $i < count($newRects); $i++)  // size check
			if ($newRects[$i][2] < 1 || $newRects[$i][3] < 1) {
				$ar[] = $rect;
				return;
			}
	
		for ($i = 0; $i < count($newRects); $i++) // recurse on each new rect
			$this->quadRecurse( $ar, $newRects[ $i ] );
	}
	
	private function quadDivide( &$rect ) {
		$pixArray = $this->getPixArrayFromRect( $rect );
		$cg = $this->getCG( $pixArray, $rect[2] );
		$cg[0] =  ($cg[0] + .5) * .5;
		$cg[1] =  ($cg[1] + .5) * .5;
		$cg[0] = 1.0 - $cg[0];
		$cg[1] = 1.0 - $cg[1] ;
	
		$centerx = ( ($cg[0] * $rect[2]) & 0xffff);
		$centerx += $rect[0];
		$centery = ( ($cg[1] * $rect[3]) & 0xffff);
		$centery += $rect[1];
	
		$widthToCenterx  = $centerx - $rect[0];
		$heightToCentery = $centery - $rect[1];
	
		$rect1 = array( $rect[0], $rect[1], $widthToCenterx, $heightToCentery ); // UL
		$rect2 = array( $rect[0], $centery, $widthToCenterx, $rect[3] - $heightToCentery); // LL
		$rect3 = array( $rect[0] + $widthToCenterx, $rect[1], $rect[2] - $widthToCenterx, $heightToCentery ); // UR
		$rect4 = array( $rect[0] + $widthToCenterx, $centery, $rect[2] - $widthToCenterx, $rect[3] - $heightToCentery ); // LR
	
		return array( $rect1, $rect2, $rect3, $rect4 );
	}
	
	private function isDivisible( &$rect ) {
	
		if ($rect[2] < $this->wthreshold || $rect[3] < $this->hthreshold)
			return false;
	
		$pixArray = $this->getPixArrayFromRect( $rect );
		$rms = $this->getRMSError( $pixArray );
	
		if ($rms < $this->rmserr)
			return false;
	
		return true;
	}
	
	private function getPixArrayFromRect( $rect ) {
		$arr=array();
		for($y = $rect[1]; $y < $rect[1]+$rect[3]; $y ++) {
			for($x = $rect[0]; $x < $rect[0]+$rect[2]; $x ++) {
				$arr[]=imagecolorat ( $this->_truecolorimage, $x, $y );
			}
		}
		return $arr;
		// 		$sub = Image.getSubimage( rect[0],rect[1],rect[2],rect[3] );
		// 		return sub.getRGB(0, 0, rect[2], rect[3], null, 0, rect[2]);
	}
	
	private function intToHex( $rgb ) {
		$r = ($rgb >> 16) & 0xFF;
		$g = ($rgb >> 8) & 0xFF;
		$b = $rgb & 0xFF;
		return sprintf ( "#%02x%02x%02x", $r, $g, $b );
	
		// 		$num *= 1;
		// 		$hexStr = '000000' + (num).toString(16);
		// 		while ( hexStr.length > 6)
			// 			hexStr = hexStr.substring(1);
	
		// 		return "#" + hexStr;
	}
	
	private function awtColorToHex( $awt ) {
		// 		theInt = (awt.getRed()<<16)|(awt.getGreen()<<8)|awt.getBlue();
		// 		return intToHex( theInt );
		$r = ($awt >> 16) & 0xFF;
		$g = ($awt >> 8) & 0xFF;
		$b = $awt & 0xFF;
		return ($r<<16)|($g<<8)|$b;
	}
	
	private function outputSVGRect( $r, $color ) {
		$str = "<rect x=";
		$str .= "\"" . $r[0] . "\" ";
		$str .= "y=\"" . $r[1] . "\" ";
		$str .= "width=\"" . $r[2] . "\" ";
		$str .= "height=\"" . $r[3] . "\" ";
		$str .= "fill=\"" . $color . "\" ";
		$str .= "stroke=\"" . $color . "\" ";
		$str .= "/>\r";
		return $str;
	}

	private function getAverageAWTColor( $input ) {
		// 		$ave = $this->getAverageColor( $input );
		// 		$red = ($ave >> 16) & 0xFF;
		// 		$green = ($ave >> 8) & 0xFF;
		// 		$blue = $ave & 0xFF;
		// 		return $this->awtColor($red,$green,$blue);
		return $this->getAverageColor( $input );
	}
	
	private function getAverageColor( $input ) {
		$red = 0;
		$green = 0;
		$blue = 0;
		$pvalue = 0;
		$averageRed = 0;
		$averageGreen = 0;
		$averageBlue = 0;
	
		$len = count($input);
	
		for ($i = 0; $i < $len; $i++) {
			$pvalue = $input[$i];
			$red = (($pvalue >> 16) & 0xFF);
			$green = (($pvalue >> 8) & 0xFF);
			$blue = $pvalue & 0xFF;
			$averageRed += $red;
			$averageGreen += $green;
			$averageBlue += $blue;
		}
	
		$averageRed /= $len;
		$averageGreen /= $len;
		$averageBlue /= $len;
	
		return ($averageRed << 16) | ($averageGreen << 8) | $averageBlue;
	}
	
	private function getIntensity( $pvalue ) {
		$red = (($pvalue >> 16) & 0xFF);
		$green = (($pvalue >> 8) & 0xFF);
		$blue = $pvalue & 0xFF;
		$intensity = $red + $blue + 2 * $green;
		return $intensity/1024;
	}
	
	private function makeNailimage( $inputFilePathIn,$outputFilePathIn )
	{
		$targetRedIn=128;
		$targetGreenIn=128; 
		$targetBlueIn=128;
		
		$im_src = imagecreatefrompng ( $inputFilePathIn );
		$im_dst = imagecreatefrompng ( $inputFilePathIn );
		$width = imagesx ( $im_src );
		$height = imagesy ( $im_src );
		
		imagefill ( $im_dst, 0, 0, IMG_COLOR_TRANSPARENT );
		imagesavealpha ( $im_dst, true );
		imagealphablending ( $im_dst, true );
		
		$flagOK = 1;
		for($x = 0; $x < $width; $x ++) {
			for($y = 0; $y < $height; $y ++) {
				$rgb = imagecolorat ( $im_src, $x, $y );
				$colorOldRGB = imagecolorsforindex ( $im_src, $rgb );
				$alpha = $colorOldRGB ["alpha"];
				$colorNew = imagecolorallocatealpha ( $im_src, $targetRedIn, $targetGreenIn, $targetBlueIn, $alpha );
				
				$flagFoundColor = true;

				$colorOld = imagecolorallocatealpha($im_src, $colorOldRGB["red"], $colorOldRGB["green"], $colorOldRGB["blue"], 0); // original color WITHOUT alpha channel
				$color2Change = imagecolorallocatealpha($im_src, 0, 0, 0, 0); // opaque BLACK - change to desired color
				$flagFoundColor = ($color2Change == $colorOld);
				
				if (false === $colorNew) {
					$flagOK = 0;
				} else if ($flagFoundColor) {
					imagesetpixel ( $im_dst, $x, $y, $colorNew );
				}
			}
		}
		imagepng ( $im_dst, $outputFilePathIn );
		imagedestroy ( $im_dst );
		imagedestroy ( $im_src );
	}
	
}