<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Gaana extends CI_Controller {
	public function index()
	{
        $segments = array('http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment1_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment2_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment3_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment4_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment5_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment6_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment7_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment8_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment9_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment10_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment11_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment12_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment13_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment14_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment15_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment16_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment17_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment18_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment19_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment20_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment21_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment22_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment23_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088',
            'http://vodhls-vh.akamaihd.net/i/songs/87/1954887/22160163/22160163_64.mp4/segment24_0_a.ts?set-akamai-hls-revision=5&hdntl=exp=1504035725~acl=/i/songs/87/1954887/22160163/22160163_64.mp4/*~data=hdntl~hmac=e978b443d1f53271794d1be2f5bd6b09a80ac16fb6438dc5a4931dc8b8295088'
        );
        header('Access-Control-Allow-Origin: *');
        $z = '';
        foreach($segments as $s) {
            $z .= file_get_contents($s);
        }
        file_put_contents('trial/test.mp4', $z);
	}
}
