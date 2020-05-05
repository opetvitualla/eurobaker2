<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ManageRawMaterials extends MY_Controller {
			public function __construct() {
					parent::__construct();
			}

		public function index(){
			$data["title"] 		  = "Raw Materials";
			$data["page_name"]  = "Raw Materials";
			$data['has_header'] = "includes/admin/header";
			$data['has_footer']	= "includes/index_footer";
      $data['categories'] = $this->MY_Model->getRows('eb_raw_materials_cat', $options = array(), 'row_array');
			$data["items"] 		= _get_items();

			$this->load_page('index',$data);

		}

    public function getRawMaterials() {
      $limit        = $this->input->post('length');
      $offset       = $this->input->post('start');
      $search       = $this->input->post('search');
      $order        = $this->input->post('order');
      $draw         = $this->input->post('draw');
      $column_order = array(
                        'PK_raw_materials_id',
                        'category_name',
                        'material_name',
                        'unit',
                        // 'average_cost',
                        'sales_price',
                      );
      $join         = array(
                        "eb_raw_materials_cat" => "eb_raw_materials_cat.PK_category_id = eb_raw_materials_list.FK_category_id"
                      );
      $select       = "PK_raw_materials_id, FK_outlet_id, FK_category_id, category_name, material_name, unit, sales_price";
      $where        = array(
                        'eb_raw_materials_list.status' => 1,
                        'eb_raw_materials_list.FK_outlet_id' => _get_branch_assigned()
                      );



      $group        = array();
      $list         = $this->MY_Model->get_datatables('eb_raw_materials_list',$column_order, $select, $where, $join, $limit, $offset ,$search, $order, $group);

      $list_of_raw_materials = array(
                                  "draw" => $draw,
                                  "recordsTotal" => $list['count_all'],
                                  "recordsFiltered" => $list['count'],
                                  "data" => $list['data']
                                );
      echo json_encode($list_of_raw_materials);
    }

    public function addRawMaterial() {
      $post         = $this->input->post();

			if (!empty($post['related_item_id'])) {
				$data         = array(
	                        'FK_outlet_id'        => 1,
	                        'material_name'       => $post['material_name'],
	                        'FK_category_id'      => $post['category'],
	                        'unit'                => $post['unit'],
	                        'sales_price'         => $post['sales_price'],
													'related_item_id'			=> $post['related_item_id'],
	                        'status'              => 1
	                      );
			} else {
				$get_max_id  		= $this->MY_Model->raw('SELECT MAX(related_item_id) FROM eb_raw_materials_list', 'row'); //get max id of related items
				$new_related_id	=	$get_max_id[0]['MAX(related_item_id)']+ 1;
				$data       	  = array(
		                        'FK_outlet_id'        => 1,
		                        'material_name'       => $post['material_name'],
		                        'FK_category_id'      => $post['category'],
		                        'unit'                => $post['unit'],
		                        'sales_price'         => $post['sales_price'],
														'related_item_id'			=> $new_related_id,
		                        'status'              => 1
		                      );
			}

      $insert_data  = $this->MY_Model->insert('eb_raw_materials_list',$data);

      if ($insert_data) {
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

    public function viewDetails() {
      $data_id          = $this->input->post('id');
      $options['where'] = array(
                            'PK_raw_materials_id' => $data_id
                          );
      $options['join'] = array(
                            "eb_raw_materials_cat" => "eb_raw_materials_cat.PK_category_id = eb_raw_materials_list.FK_category_id"
                          );
      $data             = $this->MY_Model->getRows('eb_raw_materials_list', $options, 'row');
      echo json_encode($data);
    }

    public function updateDetails() {
      $data         = $this->input->post();
      $set          = array(
                        'material_name' => $data['material_name'],
                        'FK_category_id'=> $data['category'],
                        'unit'          => $data['unit'],
                        'sales_price'   => $data['sales_price'],
                      );
      $where        = array(
                        'PK_raw_materials_id' => $data['id']
                      );
      $update_data  = $this->MY_Model->update('eb_raw_materials_list',$set,$where);

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

	public function Categories(){
		$data["title"] 		  = "Categories";
		$data["page_name"]  = "Raw Materials > Categories";
		$data['has_header'] = "includes/admin/header";
		$data['has_footer']	= "includes/index_footer";

		$this->load_page('categories',$data);
	}

	public function getCategories() {
		$limit        = $this->input->post('length');
		$offset       = $this->input->post('start');
		$search       = $this->input->post('search');
		$order        = $this->input->post('order');
		$draw         = $this->input->post('draw');
		$column_order = array(
											'PK_category_id',
											'category_name',
											'date_added',
											'date_updated',
										);
		$join         = array();
		$select       = "*";
		$where        = array();
		$group        = array();
		$list         = $this->MY_Model->get_datatables('eb_raw_materials_cat',$column_order, $select, $where, $join, $limit, $offset ,$search, $order, $group);

		$list_of_categories = array(
																"draw" => $draw,
																"recordsTotal" => $list['count_all'],
																"recordsFiltered" => $list['count'],
																"data" => $list['data']
															);
		echo json_encode($list_of_categories);
	}

	public function addCategory() {
		$category         = $this->input->post();

		$insert_data  = $this->MY_Model->insert('eb_raw_materials_cat',$category);

		if ($insert_data) {
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

	public function viewCategoryDetails() {
		$data_id          = $this->input->post('id');
		$options['where'] = array(
													'PK_category_id' => $data_id
												);
		$data             = $this->MY_Model->getRows('eb_raw_materials_cat', $options, 'row');

		echo json_encode($data);
	}

	public function updateCategoryDetails() {
		$data         = $this->input->post();
		$set          = array(
											'category_name' => $data['category_name'],
										);
		$where        = array(
											'PK_category_id' => $data['id']
										);
		$update_data  = $this->MY_Model->update('eb_raw_materials_cat',$set,$where);

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

	public function unit_conversion(){

		$data["title"] 		= "Unit Conversion";
		$data["page_name"]  = "Unit Conversion";
		$data['has_header'] = "includes/admin/header";
		$data['has_footer']	= "includes/index_footer";
		$data['has_modal']	= "modal/modal";

		$this->load_page('unit_conversion',$data);

	}

	public function save_unit_conversion(){
		
		$reponse = array("result" => false);

		$post = json_decode($this->input->post("unit_items"));

		if(!empty($post)){
			
			$item_id = $post[0]->item_id;

			$data = array(
				"fk_item_id" => $item_id,
				"status" => 1,
				"date_added" => date("Y-m-d"),
				"date_updated" => date("Y-m-d"),
				"total_items" => count($post)
			);

			$new_added_id = insertData("eb_unit_converted", $data);

			if(!empty($new_added_id)){

				foreach ($post as $key) {
					$data = array(
						"fk_unit_con_id" => $new_added_id,
						"fk_new_unit_id" => $key->new_unit,
						"uom_value" 	 => 	$key->uom_value,
						"new_unit_value" => $key->new_unit_value,
					);

					insertData("eb_unit_coverted_item", $data);
				}

				$reponse = array("result" => true);
			}

		}

		echo json_encode($reponse);

	}

	public function getunitconverted_table() {
		$limit        = $this->input->post('length');
		$offset       = $this->input->post('start');
		$search       = $this->input->post('search');
		$order        = $this->input->post('order');
		$draw         = $this->input->post('draw');

		$column_order = array(
			'fk_item_id',
			'item.material_name',
			'item.unit',
			'con_unit.total_items',
			'con_unit.date_updated',
		);
		$join         = array(
			"eb_raw_materials_list item" => "item.PK_raw_materials_id = con_unit.fk_item_id",
		);

		$select       = "*";
		$where        = array();
		$group        = array();
		$list         = $this->MY_Model->get_datatables('eb_unit_converted con_unit',$column_order, $select, $where, $join, $limit, $offset ,$search, $order, $group);

		$list_items = array(
			"draw" => $draw,
			"recordsTotal" => $list['count_all'],
			"recordsFiltered" => $list['count'],
			"data" => $list['data']
		);

		echo json_encode($list_items);
	}

	public function get_unit_data($con_id = 0){
		$reponse = array("result" => false);

		if($con_id != 0){
			$par["select"] = "*";
			$par["where"]  = array(
				"pk_unit_con_id" => $con_id,
				"con_data.status" => 1,
			);
			$par["join"] = array(
				"eb_raw_materials_list item" => "item.PK_raw_materials_id = con_data.fk_item_id"
			);

			$get_data = getData("eb_unit_converted con_data", $par);

			if(!empty($get_data)){
				unset($par["join"]);
				$par["where"]  = array(
					"fk_unit_con_id" => $con_id
				);

				$data = getData("eb_unit_coverted_item con", $par);
				if(!empty($data)){
					$get_data[0]["items"] = $data;
					$reponse = array("result" => true, "data" => $get_data);
				}
			}
		
		}

		echo json_encode($reponse);
	}

	public function update_unit_conversion(){

		$reponse = array("result" => false);

		$post = json_decode($this->input->post("unit_items"));

		if(!empty($post)){
			
			$item_id = $post[0]->item_id;
			$unit_con_id = $post[0]->unit_con_id;

			$data = array(
				"date_updated" => date("Y-m-d"),
				"total_items" => count($post)
			);
			$where = array( "pk_unit_con_id" => $unit_con_id );
			
			updateData("eb_unit_converted", $data, $where);

			$where = array( "fk_unit_con_id" => $unit_con_id );

			deleteData("eb_unit_coverted_item", $where);

			foreach ($post as $key) {
				$data = array(
					"fk_unit_con_id" => $unit_con_id,
					"fk_new_unit_id" => $key->new_unit,
					"uom_value" 	 => $key->uom_value,
					"new_unit_value" => $key->new_unit_value,
				);

				insertData("eb_unit_coverted_item", $data);
			}

			$reponse = array("result" => true);

		}

		echo json_encode($reponse);

	}

}
