$(document).ready(function() {
	// var purchase_orders = $('#purchase_Orders').DataTable();
	var base_url = $('.base_url').val();

	var table_disc = $('#table_disc').DataTable({
		"language": { "infoFiltered": "" },
		"processing": true, //Feature control the processing indicator.
		"serverSide": true, //Feature control DataTables' server-side processing mode.
		"responsive": true,
		"order": [[0, 'desc']], //Initial no order.
		"createdRow": function (row, data, dataIndex) {
		},
		"columns": [
			{
				"data": "fk_purchase_id", "render": function (data, type, row, meta) {
					var str = 'PO-' + row.fk_purchase_id;
					return str;
				}
			},
			{ "data": "date_added" },
			{ "data": "firstname" },
			{
				"data": "PK_purchase_order_id", "render": function (data, type, row, meta) {
					return `<a class='text-success btn-view-items' data-id="${row.fk_purchase_id}" ><i class='fa fa-eye'></i></a>`;
				}
			},
		],
		"ajax": {
			"url": base_url + "purchaseorderdiscrepancy/get_purchaseorder_discrepancy",
			"type": "POST"
		},
		"columnDefs": [
			{
				"targets": [3],
				"orderable": false,
			},
		],
	});

	$(document).on("click", ".btn-view-items", function () {
		alert(1)
	})

})


