<?php

class MockData
{
    public function __construct($name) {
        $filename=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'mockdata'.DIRECTORY_SEPARATOR.$name.'.json';

        if(file_exists($filename)){


            $data = @file_get_contents( $filename, false, stream_context_create( $arrContextOptions ) );
            
            if ( $data  ) {
            
                $data = json_decode( $data, true );
            
            }   
            header('Content-Type: application/vnd.api+json');
            echo json_encode($data); 
        } else {
            $filename=dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'mockdata'.DIRECTORY_SEPARATOR.$name.'.jpeg';
            header("Pragma: public");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: public");
            header('Content-type: image/jpeg');
            // header('Content-Disposition: attachment; filename="'.basename($filename).'"');
            header("Content-Length: ".filesize($filename));
        
            $fp = @fopen($filename, "rb");
            if ($fp) {
                while(!feof($fp)) {
                    echo fread($fp, 8192);
                    flush(); 
                }
                @fclose($filename);
            }
        }


    }
}



?>