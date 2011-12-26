<?php
/**
 * Model
 * @author: Christian Engel <hello@wearekiss.com> 
 * @version: 1 24.12.11
 */

class Model {
    /**
     * Checks, if a file with a specific content checksum is already stored.
     * @return boolean
     */
    function is_stored($data){
        if(!$data) return array('error' => 'invalid hash');
        $folder = substr($data, 0, 2);
        $file = substr($data, 2);
        return file_exists('storage/'.$folder.'/'.$file);
    }

    /**
     * This stores a submitted item on the harddrive.
     * @param $data
     * @return bool
     */
    function store($data){
        $hash = $data[0];
        $content = $data[1];
        if(md5($content) != $hash) return FALSE;
        if(is_stored($content)) return FALSE;
        $folder = substr($hash, 0, 2);
        $file = substr($hash, 2);
        $commapos = strpos($content, ',');
        if(!file_exists('storage/'.$folder)) mkdir('storage/'.$folder);
        file_put_contents('storage/'.$folder.'/'.$file, base64_decode(substr($content, $commapos)));
        return TRUE;
    }

    /**
     * This takes all the needed images and positions/dimensions and build a ZIP file containing the spritemap PNG and CSS file.
     * Returned will be an URL of where to download the archive, or in case of an error: FALSE.
     * @param $data
     * @return string|FALSE
     */
    function download($data){
        $document_width = (int)@$data['width'];
        $document_height = (int)@$data['height'];
        $sprites = @$data['sprites'];
        $hashnam = '';

        if(!$document_height || !$document_width) return FALSE;
        if(!is_array($sprites)) return FALSE;
        if(!count($sprites)) return FALSE;

        $hashnam = $document_height.$document_width;

        $img = imagecreatetruecolor($document_width, $document_height);
        imagealphablending($img, TRUE);
        imagesavealpha($img, TRUE);
        $transp = imagecolorallocatealpha($img, 0, 0, 0, 127);
        imagecolortransparent($img, $transp);
        imagefill($img, 0, 0, $transp);

        foreach($sprites as $sprite){
            $hashnam .= $sprite['hash'];
            $folder = substr($sprite['hash'], 0, 2);
            $file = substr($sprite['hash'], 2);

            $sprite_img = imagecreatefrompng('storage/'.$folder.'/'.$file);
            imagealphablending($sprite_img, TRUE);
            imagesavealpha($sprite_img, TRUE);
            imagecopyresampled($img, $sprite_img, $sprite['x'], $sprite['y'], 0, 0, $sprite['w'], $sprite['h'], $sprite['w'], $sprite['h']);
        }

        ob_start();
        imagepng($img, NULL, 9);
        $imgdata = ob_get_clean();
        ob_end_clean();

        //=====================================================================
        $cssdata = '';

        //Now generate the CSS!
        foreach($sprites as $sprite){
            $cssdata .= '.'.$sprite['classname'].'{'."\n";
            $cssdata .= "\t".'background-position: -'.$sprite['x'].'px -'.$sprite['y'].'px;'."\n";
            $cssdata .= "\t".'width: '.$sprite['w'].'px;'."\n";
            $cssdata .= "\t".'height: '.$sprite['h'].'px;'."\n";
            $cssdata .= "}\n\n";
        }


        $filename = 'download/'.md5($cssdata).'.zip';
        $zip = new ZipArchive();
        $zip->open($filename, ZIPARCHIVE::CREATE);
        $zip->addFromString('sprites.png', $imgdata);
        $zip->addFromString('sprites.css', $cssdata);
        $zip->close();

        return $filename;
    }
}
