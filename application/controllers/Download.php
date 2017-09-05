<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Download extends CI_Controller {
	public function index()
	{
        header('Access-Control-Allow-Origin: *');
		ini_set('memory_limit', '512M');
		$source = $this->input->post('source');
		// Warning
		// dir_name should not contain any trailing slash
		$dir_name = $this->input->post('dir_name');
        $mp4_source = $this->input->post('mp4_source');

		define('BASE_DIR', '/var/www/html/grabber/assets/');
		$dir_name = BASE_DIR . $dir_name;
		if ($source == 'treehouse') {
			$this->treehouse_download_video($dir_name, $mp4_source);
		}
		else if ($source == 'lynda') {
			$file_name = $this->lynda_file_name_get($mp4_source);
			if ($file_name) {
				$this->download_video($dir_name, $file_name, $mp4_source);
			}
		}
	}
	public function download_video($dir_name = false, $file_name = false, $mp4_source = false) {
		if (!file_exists($dir_name)) {
			mkdir($dir_name, 0755, true);
		}
		if (!file_exists($dir_name . DIRECTORY_SEPARATOR . $file_name)) {
			$file_content = file_get_contents($mp4_source);
			file_put_contents($dir_name . DIRECTORY_SEPARATOR . $file_name, $file_content);
		}
	}
	public function lynda_file_name_get($mp4_source = false) {
		$file_name = false;
		if ($mp4_source) {
			// Sample mp4_source
			// https://lynda_files2-a.akamaihd.net/secure/courses/167065/VBR_MP4h264_main_SD/167065_02_02_MM30_how.mp4?c3.ri=3774749779903443748&hashval=1504645074_d1e97d2edd2779a158ed9b0e1763583f
			$parts = explode('/secure/courses/', $mp4_source);
			if (count($parts) > 1) {
				$temp = explode('?', $parts[1])[0];
				$file_name = array_values(array_slice(explode('/', $temp), -1))[0];
			}
		}
		return $file_name;
	}
	public function treehouse_download_video($dir_name = false, $mp4_source = false) {
		if ($dir_name && $mp4_source) {
			// Sample mp4_source
			// https://videos.teamtreehouse.com/videos/TH-Workshops-StaticPagesinRails-720p-clip.mp4?token=59b17e8c_2b02d6cf054c2e66fd995e5ed87120040d75f722
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
