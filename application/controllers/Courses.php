<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Courses extends CI_Controller
{
    public function download()
    {
        header('Access-Control-Allow-Origin: *');
        $course_id = $this->input->post('course_id');

        if ($course_id > 0) {
            $this->db->where('course_id', $course_id);
            $this->db->update('courses', array('downloaded' => 1));
        }
    }
    public function index()
    {
        header('Access-Control-Allow-Origin: *');
        $course['course_id'] = $this->input->post('course_id');
        $course['course_title'] = $this->input->post('course_title');
        $course['category'] = $this->input->post('category');
        $course['subcategory'] = $this->input->post('subcategory');

        $course['duration'] = $this->input->post('duration');
        $course['release_date'] = $this->input->post('release_date');
        $course['release_year'] = $this->input->post('release_year');
        $course['release_month'] = $this->input->post('release_month');

        $course['level'] = $this->input->post('level');
        $course['views'] = $this->input->post('views');
        $course['author'] = $this->input->post('author');

        if ($course['course_id'] > 0) {
            $sql = 'INSERT INTO courses (course_id, course_title, category, subcategory, duration, release_date, release_year, release_month, level, views, author)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE
					views=VALUES(views), duration=VALUES(duration)';

            $query = $this->db->query($sql, $course);

            $this->db->select('*');
            $this->db->from('courses');
            $this->db->where('course_id', $course['course_id']);
            $course = $this->db->get()->row();

            $this->endpoint_respond(200, array('course' => $course));
        }
        $this->endpoint_respond(400, array('error' => 'Invalid course_id'));
    }
    public function endpoint_respond($http_response_code, $message, $json_encode = true, $additional_headers = array())
    {
        foreach ($additional_headers as $additional_header) {
            header($additional_header);
        }
        http_response_code($http_response_code);
        if ($json_encode) {
            echo json_encode($message);
        } else {
            echo $message;
        }
        die();
    }
}
