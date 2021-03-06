<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Purchaseorderdiscrepancy extends MY_Controller {
	public function __construct() {
		parent::__construct();

	}
	
	public function index(){
		$data["title"] 	 	= "Discrepancy";
		$data["page_name"]  = "Discrepancy";
		$data['has_header'] = "includes/admin/header";
		$data['has_footer']	= "includes/index_footer";
		
		if (get_user_type() == 1) {
			$this->load_page('index',$data);
		} 
	}

	public function get_purchaseorder_discrepancy(){
		$limit        = $this->input->post('length');
		$offset       = $this->input->post('start');
		$search       = $this->input->post('search');
		$order        = $this->input->post('order');
		$draw         = $this->input->post('draw');
		
		$column_order = array(
			'pod.fk_purchase_id',
			'pod.date_added',
			'user.firstname',
		);
		$join         = array(
			"eb_purchase_order po" 	=> "po.PK_purchase_order_id = pod.fk_purchase_id",
			"eb_users_meta user" 	=> "user.FK_user_id = po.FK_user_id",
		);
		$select       = "pod.fk_purchase_id, pod.date_added, user.firstname";
		$where        = array(
			'pod.status ' => 1,
		);
		$group        = array();
		$list         = $this->MY_Model->get_datatables('eb_purchase_order_discrepancy pod', $column_order, $select, $where, $join, $limit, $offset ,$search, $order, $group);
		
		$list_results = array(
			"draw" => $draw,
			"recordsTotal" => $list['count_all'],
			"recordsFiltered" => $list['count'],
			"data" => $list['data']
		);
		echo json_encode($list_results);
	}

}

	
