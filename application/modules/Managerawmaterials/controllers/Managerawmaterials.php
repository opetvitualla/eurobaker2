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

}
