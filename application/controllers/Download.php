<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Download extends CI_Controller {
	public function index()
	{
        header('Access-Control-Allow-Origin: *');
		define('BASE_DIR', '/var/www/html/treehouse/assets/');
		ini_set('memory_limit', '512M');
        $dir_name = $this->input->post('dir_name');
        $mp4_source = $this->input->post('mp4_source');
        if ($dir_name && $mp4_source) {
            $parts = explode('/videos/', $mp4_source);
            if (count($parts) > 1) {
                $file_name = explode('?token=', $parts[1])[0];
				$dir_name = BASE_DIR . $dir_name;
				if (!file_exists($dir_name)) {
	                mkdir($dir_name, 0755, true);
	            }
                if (!file_exists($dir_name . DIRECTORY_SEPARATOR . $file_name)) {
                    $file_content = file_get_contents($mp4_source);
                    file_put_contents($dir_name . DIRECTORY_SEPARATOR . $file_name, $file_content);
                }
            }
        }
	}
}
