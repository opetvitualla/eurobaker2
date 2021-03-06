$(document).ready(function () {
    var base_url = $('.base_url').val();

    let items = [];
    let units = [];

    let is_add_item = false;

    axios.get(`${base_url}global_api/get_items`).then(res => {
        //  suppliers = JSON.parse(res.data.data);
        items = res.data.data;
    })

    axios.get(`${base_url}global_api/get_units`).then(res => {
        //  suppliers = JSON.parse(res.data.data);
        units = res.data.data;
    })

    $(".show-add-modal").click(function () {
        $(".add_so_modal").modal();
        $(".btn-add-item").trigger("click")
        $(".table-po-body").html("");
        $(".supplier_select").select2();
        is_add_item = true;
        $(".total-item").html(0)
        $(".over-total").html(0)

    })

    var table_purchase_order = $('#stock_Out').DataTable({
        "language": { "infoFiltered": "" },
        "processing": true, //Feature control the processing indicator.
        "serverSide": true, //Feature control DataTables' server-side processing mode.
        "responsive": true,
        "order": [[0, 'desc']], //Initial no order.
        "createdRow": function (row, data, dataIndex) {
            if (data.status == "approved") {
                $(row).addClass("row_stock_received");
            }
        },
        "columns": [
            {
                "data": "PK_stock_out_id", "render": function (data, type, row, meta) {
                    var str = 'SO-' + row.PK_stock_out_id;
                    return str;
                }
            },
            { "data": "segment_name" },
            { "data": "total_items" },
            { "data": "total_amount" },
            { "data": "firstname" },
            { "data": "status" },
            { "data": "date_added" },
            {
                "data": "PK_stock_out_id", "render": function (data, type, row, meta) {
                    var str = '<div class="mx-auto action-btn-div"> <a href="javascript:;" class="edit-btn btn_edit_so" data-id="' + row.PK_stock_out_id + '"><i class="fa fa-edit"></i></a></div>';
                 

                    if (row.status == "approved") {
                        str = '<div class="mx-auto action-btn-div">';
                        str += '<a href="javascript:;" class="po_view_received text-success" data-id="' + row.PK_stock_out_id + '" title="view"><i class="fa fa-eye"></i></a></div>';
                    }
                    return str;
                }
            },
        ],
        "ajax": {
            "url": base_url + "stockout/get_stockout_data",
            "type": "POST"
        },
        "columnDefs": [
            {
                "targets": [3],
                "orderable": false,
            },
        ],
    });

    $(".btn-add-item").click(function () {
        let options = "<option  value=''>Please select an item</option>";
        items.map(item => {
            options += `<option data-id="${item.PK_raw_materials_id}" value="${item.material_name}">${item.material_name}</option>`;
        })

        let option_units = "";
        units.map(unit => {
            option_units += `<option data-id="${unit.PK_unit_id}" value="${unit.unit_name}">${unit.unit_name}</option>`;
        })


        let html = `
			<tr>
				<td>
					<select required class="itemselect form-control" style="width: 100%;">
						<optgroup label="Select an item">
							${options}
						</optgroup>
					</select>
				</td>
			<td>
					<input type="number"  class="form-control item-qty" name="" min="1" value="1">
			</td>
			<td>
				<select name="unit" class="form-control item-unit" required">
				    ${option_units}
				</select>
			</td>
			<td>
				<input required readonly type="text" class="form-control item-price">
			</td>
			<td>
				<input required readonly type="text" class="form-control item-total">
			</td>
			<td>
				<a style="font-size:16px;" href="javascript:;" class="mx-auto fa fa-trash text-danger remove-po-item"></a>
			</td>
				
			</tr>
		`
        if (is_add_item) {
            $(".table-po-body").append(html);
        }
        else {
            $(".table-po-body-edit").append(html)
        }
        $(".itemselect").select2();
    })


    // submit
    $("#Stock_out_Add").submit(function (e) {
        e.preventDefault();
        let overTotal = $(".over-total").html();
        let segment_id = $(".supplier_select option:selected").val()

        if (Number(overTotal) == 0) {
            s_alert("Please add atleast one item", "error")
            return
        }
        else if (!validated_table()) {
            s_alert("Please input the required items", "error")
            return
        }
        else if (segment_id == 0 || segment_id == undefined) {
            s_alert("Please select a supplier first", "error")
            return
        }

        confirm_alert("Are you sure to save this Purchase Order?").then(res => {
            let frmdata = new FormData();

            let po_items = [];
            let total_items = $(".total-item").html();
            let over_total = $(".over-total").html();

            $(".table-po-body tr").each(function () {
                let row = $(this);
                let item_ids = row.find(".itemselect option:selected").attr("data-id")
                po_items.push({
                    item_id: item_ids,
                    quantity: row.find(".item-qty").val(),
                    unit: row.find(".item-unit").val(),
                    price: row.find(".item-price").val(),
                })
            })

            frmdata.append("segment_id", segment_id);
            frmdata.append("over_total", over_total);
            frmdata.append("total_items", total_items);
            frmdata.append("so_items", JSON.stringify(po_items));

            axios.post(`${base_url}stockout/save_stock_out`, frmdata).then(res => {
                if (res.data.result == "success") {
                    s_alert("Successfully Saved!", "success");
                    table_purchase_order.ajax.reload();
                    setTimeout(() => { $('.add_so_modal').modal('hide'); }, 1000);
                }
            })
        })

    })

    $("#stock_out_edit_form").submit(function (e) {
        e.preventDefault();

        let overTotal = $(".over-total").html();
        let segment_id = $(".supplier_select_edit option:selected").val()
        let so_id = $(".so_edit_id").val();

        if (Number(overTotal) == 0) {
            s_alert("Please add atleast one item", "error")
            return
        }
        else if (!validated_table()) {
            s_alert("Please input the required items", "error")
            return
        }
        else if (segment_id == 0 || segment_id == undefined) {
            s_alert("Please select a supplier first", "error")
            return
        }

        confirm_alert("Are you sure to update this request?").then(res => {
            let frmdata = new FormData();

            let po_items = [];
            let total_items = $(".total-item").html();
            let over_total = $(".over-total").html();

            $(".table-po-body-edit tr").each(function () {

                let row = $(this);
                let item_ids = row.find(".itemselect option:selected").attr("data-id")
                po_items.push({
                    item_id: item_ids,
                    quantity: row.find(".item-qty").val(),
                    unit: row.find(".item-unit").val(),
                    price: row.find(".item-price").val(),
                })
            })

            frmdata.append("segment_id", segment_id);
            frmdata.append("over_total", over_total);
            frmdata.append("so_id", so_id);
            frmdata.append("total_items", total_items);
            frmdata.append("so_items", JSON.stringify(po_items));

            axios.post(`${base_url}stockout/update_stock_out`, frmdata).then(res => {
                if (res.data.result == "success") {
                    s_alert("Successfully Updated!", "success");
                    table_purchase_order.ajax.reload();
                    setTimeout(() => { $('.edit_so_modal').modal('hide'); }, 1000);
                }
            })
        })
    })

    $(document).on("click", ".po_recieved-btn", function () {

        let po_id = $(this).data("id");

        confirm_alert("Are you sure to approved this request?").then(res => {
            let frmdata = new FormData();
            frmdata.append("po_id", po_id);

            axios.post(`${base_url}stockout/approve_request_form`, frmdata).then(res => {
                if (res.data.result == "success") {
                    s_alert("Updated Successfully!", "success");
                    table_purchase_order.ajax.reload();
                }
            })

        })
    })

    $(document).on("click", ".btn_edit_so", function () {
        let so_id = $(this).data("id");
        $(".so_edit_id").val(so_id)
        is_add_item = false;
        axios.get(`${base_url}stockout/get_so_details/${so_id}`).then(res => {
            if (res.data.result == "success") {
                let datas = res.data.data;
                let so_items = datas[0].so_items
                $(".table-po-body-edit").html("")
                $(".supplier_select_edit option").removeAttr("selected");
                $(".supplier_select_edit option[value=" + datas[0].FK_segment_id + "]").attr("selected", "selected").change()

                so_items.map(so_item => {

                    let options = "<option  value=''>Please select an item</option>";

                    items.map(item => {
                        options += `<option ${so_item.FK_raw_material_id == item.PK_raw_materials_id ? 'selected' : ''} data-id="${item.PK_raw_materials_id}" value="${item.material_name}">${item.material_name}</option>`;
                    })

                    let option_units = "";
                    units.map(unit => {
                        option_units += `<option ${so_item.item_unit == unit.unit_name ? 'selected' : ''}  data-id="${unit.PK_unit_id}" value="${unit.unit_name}">${unit.unit_name}</option>`;
                    })

                    let html = `
							<tr>
								<td>
									<select required class="itemselect form-control" style="width: 100%;">
										<optgroup label="Select an item">
											${options}
										</optgroup>
									</select>
								</td>
							
							<td>
									<input type="number" value="${so_item.quantity}"  class="form-control item-qty" name="" min="1">
							</td>
							<td>
								<select name="unit" class="form-control item-unit" required">
									${option_units}
								</select>
							</td>
							<td>
								<input required readonly type="text" value="${so_item.average_cost}" class="form-control item-price">
							</td>
							<td>
								<input required readonly type="text" value="${Number(so_item.quantity) * Number(so_item.average_cost)}" class="form-control item-total">
							</td>
							<td>
								<a style="font-size:16px;" href="javascript:;" class="mx-auto fa fa-trash text-danger remove-po-item"></a>
							</td>
								
							</tr>
						`

                    $(".table-po-body-edit").append(html);
                    $(".itemselect").select2();
                })
                generateOverTotal()
            }
            $(".edit_so_modal").modal()
        })
    })


    $(document).on("click", ".remove-po-item", function () {
        let row = $(this).closest('tr');
        row.remove();
        generateOverTotal();
    })

    $(document).on("change", ".itemselect", function () {

        var elm = $("option:selected", this);
        let item_id = elm.attr("data-id");

        let item = items.find(itm => itm.PK_raw_materials_id == item_id);

        let row = $(this).closest('tr');
        if (is_item_exist(item_id)) {
            s_alert("This item is already added!", "error")
            row.remove()
            return;
        }

        let qty = row.find(".item-qty").val()
        let total = calculateTotal(item.sales_price, qty)

        row.find(".item-price").val(item.sales_price)
        row.find(".item-total").val(total)

        generateOverTotal();
    })

    $(document).on("change", ".item-qty", function () {

        let qty = Number($(this).val())
        let row = $(this).closest('tr');
        let selected = row.find(".itemselect option:selected");
        let item_id = selected.attr("data-id")
        let item = items.find(itm => itm.PK_raw_materials_id == item_id);

        let total = calculateTotal(item.sales_price, qty)

        row.find(".item-total").val(total)

        generateOverTotal();
    })


    function calculateTotal(price, qty) {
        return Number(price) * Number(qty);
    }

    function validated_table(validate_type = "add") {
        let resp = true;
        let form_id = "Purchase_Order_Add";

        if (validate_type != "add") {
            form_id = "Purchase_Order_edit_form"
        }

        $("#" + form_id + " .itemselect").each(function () {
            if ($(this).val() == "") {
                resp = false;
            }
        })
        $("#" + form_id + " .item-price").each(function () {
            if ($(this).val() == "") {
                resp = false;
            }
        })

        return resp;
    }

    function generateOverTotal() {
        let over_total = 0;
        let count = 0;
        let mod = "add_so_modal";
        if (!is_add_item) {
            mod = "edit_so_modal";
        }

        $(`.${mod} .item-total`).each(function (e) {
            over_total += Number($(this).val());
            count++;
        })

        $(".total-item").html(count)
        $(".over-total").html(over_total.toFixed(2))
    }

    function is_item_exist(item_id) {

        let count = 0;
        $(".itemselect").each(function (e, index) {
            var sel_value = $("option:selected", this).attr("data-id");
            if (item_id == sel_value) {
                count++;
            }
        })

        if (count == 2) {
            return true;
        }

        return false;
    }

})