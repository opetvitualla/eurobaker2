<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Manageemployees extends MY_Controller {

		public function index(){
			$data["title"] 		  = "List of Users";
			$data["page_name"]  = "List of Users";
			$data['has_header'] = "includes/admin/header";
			$data['has_footer']	= "includes/index_footer";
			$data['outlets'] = $this->MY_Model->getRows('eb_outlets', $options = array(), 'row_array');

      $this->load_page('index',$data);
		}

    public function getEmployees() {
      $limit        = $this->input->post('length');
      $offset       = $this->input->post('start');
      $search       = $this->input->post('search');
      $order        = $this->input->post('order');
      $draw         = $this->input->post('draw');
      $column_order = array(
                        'PK_user_id',
                        'firstname',
                        'email_address',
                        'date_added',
                      );
      $join         = array(
												'eb_users_meta'	=>	'eb_users_meta.FK_user_id = eb_users.PK_user_id',
											);
      $select       = "PK_user_id, firstname, lastname, branch_assigned, email_address, date_added";
      $where        = array();
      $group        = array();
      $list         = $this->MY_Model->get_datatables('eb_users',$column_order, $select, $where, $join, $limit, $offset ,$search, $order, $group);

      $list_of_employees = array(
                            "draw" => $draw,
                            "recordsTotal" => $list['count_all'],
                            "recordsFiltered" => $list['count'],
                            "data" => $list['data']
                          );
      echo json_encode($list_of_employees);
    }

    public function addEmployee() {
      $post         = $this->input->post();

      $data         = array(
                        'username' 				=> $post['username'],
                        'password' 				=> $post['password'],
                        'branch_assigned' => $post['outlet_id'],
                        'user_type' 			=> $post['user_type'],
                        'user_status'     => 1
                      );
      $insert_data  = $this->MY_Model->insert('eb_users',$data);

      if ($insert_data) {
				$insert_details	=	array(
														'FK_user_id'  	=> $insert_data,
														'firstname'  		=> $post['first_name'],
														'lastname'   		=> $post['last_name'],
														'email_address' => $post['email_address'],
														'age' 					=> $post['age'],
														'gender' 				=> $post['gender'],
														'address' 			=> $post['address'],
													);
				$insert_user_data  = $this->MY_Model->insert('eb_users_meta',$insert_details);
				if ($insert_user_data) {
					$response = array(
	                      'result' => 'success',
	                    );
				}

      } else {
        $response = array(
                      'result' => 'error',
                    );
      }
      echo json_encode($response);
    }

    public function viewDetails() {
      $data_id          = $this->input->post('id');
      $options['where'] = array(
                            'PK_supplier_id' => $data_id
                          );
      $data             = $this->MY_Model->getRows('eb_suppliers', $options, 'row');
      echo json_encode($data);
    }

    public function updateDetails() {
      $data         = $this->input->post();
      $set          = array(
                        'supplier_name'  => $data['supplier_name'],
                        'address'        => $data['address'],
                        'contact_number' => $data['contact_number'],
                      );
      $where        = array(
                        'PK_supplier_id' => $data['id']
                      );
      $update_data  = $this->MY_Model->update('eb_suppliers',$set,$where);

      if ($update_data) {
        $response = array(
                      'result' => 'success',
                    );
      } else {
        $response = array(
                      'result' => 'error',
                    );
      }
      echo json_encode($response);
    }

}
