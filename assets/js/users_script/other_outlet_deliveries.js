$(document).ready(function () {
    var base_url = $('.base_url').val();

    let items = [];
    let units = [];
    let purchase_orders = [];

    let is_add_item = false;


    $(".show-add-modal").click(function () {

        axios.get(`${base_url}Global_api/get_all_purchase_order_processing`).then(res => {
            //  suppliers = JSON.parse(res.data.data);
            if (res.data.result) {
                purchase_orders = res.data.data;

                let datas = res.data.data;
                let html = "<option value=''>Please select</option>";

                datas.map(data => {
                    html += ` <option value="${data.PK_purchase_order_id}">PO-${data.PK_purchase_order_id}</option> `;
                })


                $(".po_select").html(html);

                $(".po_select").select2();
                $(".new_deliver_modal").modal();
            }
        })
        
        // $(".table-po-body").html("");
        // is_add_item = true;
        // $(".total-item").html(0)
        // $(".over-total").html(0)

    })

    var table_other_order = $('#table_other_order').DataTable({
        "language": {
            "infoFiltered": ""
        },
        "processing": true, //Feature control the processing indicator.
        "serverSide": true, //Feature control DataTables' server-side processing mode.
        "responsive": true,
        "order": [
            [0, 'desc']
        ], //Initial no order.
        "createdRow": function (row, data, dataIndex) {
            if (data.status == "approved") {
                $(row).addClass("row_stock_received");
            }
        },
        "columns": [
        {
            "data": "PK_purchase_order_id",
            "render": function (data, type, row, meta) {
                var str = 'PO-' + row.PK_purchase_order_id;
                return str;
            }
        },
        { "data": "supplier_name" },
        { "data": "recieve_outlet" },
        { "data": "reciever_outlet" },
        { "data": "total_amount" },
        { "data": "date_added" },
        {
            "data": "PK_purchase_order_id",
            "render": function (data, type, row, meta) {
                var str = '<div class="mx-auto action-btn-div"> <a href="javascript:;" class="edit-btn btn_edit_so" data-id="' + row.PK_purchase_order_id + '"><i class="fa fa-edit"></i></a>';
                str += '<a href="javascript:;" id="view_Supplier_Details" class="po_recieved-btn text-success" data-id="' + row.PK_purchase_order_id + '" title="Receive"><i class="fa fa-check"></i></a></div>';

                if (row.status == "approved") {
                    str = '<div class="mx-auto action-btn-div">';
                    str += '<a href="javascript:;" class="so_view_details text-success" data-id="' + row.PK_purchase_order_id + '" title="view"><i class="fa fa-eye"></i></a></div>';
                }
                return str;
            }
        },
        ],
        "ajax": {
            "url": base_url + "other_outlet_deliveries/get_other_deliveries_data",
            "type": "POST"
        },
        "columnDefs": [{
            "targets": [3],
            "orderable": false,
        },],
    });



    $(document).on('change', '.po_select', function () {
        let id = $(this).val();
        if (id != 0) {

            axios.get(`${base_url}other_outlet_deliveries/get_po_details/${id}`).then(res => {
                if (res.data.result) {

                    let data = res.data.data;

                    let items = data[0].po_items;

                    items.map(item => {
                        let html = `
							<tr>
								<td class="item-data" data-id="${item.FK_raw_material_id}"> ${item.material_name} </td>
							<td>
								<span class="process-qty">${item.quantity}</span>
							</td>
							<td>
								${item.item_unit}
							</td>
							<td>
                                <input class="form-control" required type="text" name="item_price" value="${item.average_cost}">
							</td>
							<td>
								<input type="number" min="0" max="${item.quantity}" value="${item.quantity}" class="form-control received-qty">
							</td>
								
							</tr>
						`
                        $(".table-po-body-other").append(html);
                    })

                    $(".total-item").html(data[0].po_items.length)
                    $(".over-total").html(data[0].total_amount)
                    

                }
            })

        }
    })

    $("#other_deliveries_form").submit(function (e) {
        e.preventDefault();
        confirm_alert("Are you sure to recieve this purchase order?").then(res => {
            let frmdata = new FormData();
            let po_id = $(".po_select").val()

            let disc_items = [];

            $(".table-po-body-other tr.discrep_item").each(function () {
                let row = $(this);
                let item_ids = row.find(".item-data").attr("data-id")
                disc_items.push({
                    item_id: item_ids,
                    item_name: row.find(".item-data").text(),
                    quantity: row.find(".process-qty").text(),
                    rec_qty: row.find(".received-qty").val(),
                    unit: row.find(".item-unit").val(),
                })
            })

            let dreason = $("#discrepancy_reason").val();

            frmdata.append("po_id", po_id);
            frmdata.append("po_no", po_no);
            frmdata.append("disc_item", JSON.stringify(disc_items));
            frmdata.append("reason", dreason);

            axios.post(`${base_url}Managepurchaseorders/receive_purchase_order`, frmdata).then(res => {
                if (res.data.result == "success") {
                    s_alert("Received Successfully!", "success");
                    table_purchase_order.ajax.reload();
                }
            })

        })

    })

    $(document).on("change", ".received-qty", function () {

        let rec_qty = Number($(this).val())
        let row = $(this).closest('tr');
        let qty_row = row.find(".process-qty");

        if (Number(qty_row.text()) > rec_qty) {
            row.addClass("discrep_item");
        } else {
            row.removeClass("discrep_item");
        }

    })
})