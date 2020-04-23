$(document).ready(function() {
  var base_url = $('.base_url').val();

  var table_employees = $('#table_employees').DataTable({
       "language": { "infoFiltered": "" },
       "processing": true, //Feature control the processing indicator.
       "serverSide": true, //Feature control DataTables' server-side processing mode.
       "responsive": true,
       "order": [[0,'desc']], //Initial no order.
       "columns":[
            {"data": "FK_user_id","render":function(data, type, row, meta){
                 var str = 'EM-'+row.PK_user_id;
                 return str;
                 }
            },
            {"data":"firstname","render":function(data, type, row, meta){
                 var str = row.firstname+' '+row.lastname;
                 return str;
                 }
            },
            {"data":"email_address"},
            {"data":"date_added"},
            {"data":"PK_user_id","render":function(data, type, row, meta){
                 var str = '<div class="mx-auto action-btn-div text-center"> <a href="javascript:;" id="edit_Employee_Details" class="text-success" data-id="' + row.PK_user_id +'"><i class="fa fa-edit"></i></a>';
                 str += '<a href="javascript:;" id="view_Employee_Details"  data-id="'+row.PK_user_id+'"><i class="fa fa-eye"></i></a></div>';
                 return str;
             }
            },
       ],
       "ajax": {
            "url": base_url +"Manageemployees/getEmployees",
            "type": "POST"
       },
       "columnDefs": [
            {
                 "targets": [4],
                 "orderable": false,
             },
        ],
  });

  $(document).on('submit','#Employee_Add', function(e) {
       e.preventDefault();
       var formData = new FormData($(this)[0]);

       $.ajax({
            url: base_url + 'Manageemployees/addEmployee',
            data        : formData,
            processData : false,
            contentType : false,
            cache       : false,
            type        : 'POST',
            success     : function(data){
                          table_employees.ajax.reload();
                          $('.add_employee_modal').modal('hide');
            }
       });
  });

  $(document).on('click', '#view_Employee_Details', function() {
      var id = $(this).data('id');
      $('.view_employee_details_modal').modal('show');
      $('.view_employee_details_modal input').prop('disabled', true);

      $.ajax({
           url: base_url + 'Manageemployee/viewDetails',
           type     :  "post",
           data     :  {  "id"  : id  },
           dataType :  'json',
           success  :  function(data){
                        $('.view_employee_details_modal input[name="supplier_name"]').val(data.supplier_name);
                        $('.view_employee_details_modal input[name="address"]').val(data.address);
                        $('.view_employee_details_modal input[name="contact_number"]').val(data.contact_number);
           }
      });
  });

  $(document).on('click', '#edit_Supplier_Details', function() {
      var id = $(this).data('id');
      $('.edit_supplier_details_modal').modal('show');

      $.ajax({
           url: base_url + 'Managesuppliers/viewDetails',
           type     :  "post",
           data     :  {  "id"  : id  },
           dataType :  'json',
           success  :  function(data){
                        $('.edit_supplier_details_modal input[name="supplier_name"]').val(data.supplier_name);
                        $('.edit_supplier_details_modal input[name="address"]').val(data.address);
                        $('.edit_supplier_details_modal input[name="contact_number"]').val(data.contact_number);
                        $('.edit_supplier_details_modal .edit_Button').attr('data-id', data.PK_supplier_id);
           }
      });
  });

  $(document).on('submit','#Supplier_Edit', function(e) {
       e.preventDefault();
       var formData = new FormData($(this)[0]);
       var dataid   = $('.edit_supplier_details_modal .edit_Button').data('id');
       formData.append('id', dataid)

       $.ajax({
            url: base_url + 'Managesuppliers/updateDetails',
            data        : formData,
            processData : false,
            contentType : false,
            cache       : false,
            type        : 'POST',
            success     : function(data){
                          table_suppliers.ajax.reload();
                          $('.edit_supplier_details_modal').modal('hide');
            }
       });
  });
});
