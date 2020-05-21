<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Global_api extends MY_Controller {
		public function __construct() {
				parent::__construct();
				
		}

		public function index(){
			
		}

		public function get_suppliers(){
			$response = array(
				"data" => _get_suppliers()
			);
			echo json_encode($response);
		}

		public function get_items(){
			$response = array(
				"data" => _get_items()
			);
			echo json_encode($response);
		}

		public function get_units(){
			$response = array(
				"data" => _get_all_units()
			);
			echo json_encode($response);
		}
		
		public function get_all_purchase_order_processing(){

			$response = array( "result" => false, );

			$par['select'] = '*';
			$par['where']  = array(
				'status' => 'processing',
				"FK_branch_id !=" => _get_branch_assigned()
			);
			
			$getdata       = getData('eb_purchase_order po', $par, 'obj');

			$response = array( "result" => true, "data" => $getdata, );

			echo json_encode($response);



		}

}
