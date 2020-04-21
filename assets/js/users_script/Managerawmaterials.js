$(document).ready(function () {
     var base_url = $('.base_url').val();
     let items = [];
     axios.get(`${base_url}Global_api/get_items`).then(res => {
          items = res.data.data;
     })
     $('select[name="related_item"]').select2();

     var table_raw_materials = $('#raw_Materials').DataTable({
          "language": { "infoFiltered": "" },
          "processing": true, //Feature control the processing indicator.
          "serverSide": true, //Feature control DataTables' server-side processing mode.
          "responsive": true,
          "order": [[0, 'desc']], //Initial no order.
          "columns": [
               {
                    "data": "PK_raw_materials_id", "render": function (data, type, row, meta) {
                         var str = 'RM-' + row.PK_raw_materials_id;
                         return str;
                    }
               },
               { "data": "category_name" },
               { "data": "material_name" },
               { "data": "unit" },
               // {"data": "PK_raw_materials_id","render":function(data, type, row, meta){
               //      var str = parseFloat(row.average_cost).toFixed(2);
               //      return str;
               //      }
               // },
               {
                    "data": "PK_raw_materials_id", "render": function (data, type, row, meta) {
                         var str = parseFloat(row.sales_price).toFixed(2);
                         return str;
                    }
               },
               {
                    "data": "PK_raw_materials_id", "render": function (data, type, row, meta) {
                         var str = '<div class="action-btn-div"><a href="javascript:;" id="edit_Details" data-id="' + row.PK_raw_materials_id + '"><i class="fa fa-edit"></i></a>';
                         str += '<a href="javascript:;" id="view_Details" class="text-success"  data-id="' + row.PK_raw_materials_id + '"><i class="fa fa-eye"></i></a></div>';
                         return str;
                    }
               },
          ],
          "ajax": {
               "url": base_url + "Managerawmaterials/getRawMaterials",
               "type": "POST"
          },
          "columnDefs": [
               {
                    "targets": [5],
                    "orderable": false,
               },
          ],
     });
     $(document).on('click', '.add_new', function () {
          let html = '';
          let options = '<option value="" selected>Select here<option>';

          items.map(item => {
               options += `<option data-id="${item.PK_raw_materials_id}" value="${item.material_name}">${item.material_name}<option>`;
          });

          html += `<optgroup label="Select an item">
                ${options}
              </optgroup>`;

          $('select[name="related_item"]').append(html);
          $('.add_raw_material_modal').modal('show');
     });

     $('select[name="related_item"]').on('change', function () {
          var elm = $("option:selected", this);
          let item_id = elm.attr("data-id");

          let item = items.find(itm => itm.PK_raw_materials_id == item_id);
          $('#Raw_Material_Add input, #Raw_Material_Add select[name="category"]').prop('readonly', true)

          $('input[name="related_item_id"]').val(item.related_item_id);
          $('input[name="material_name"]').val(item.material_name);
          $('select[name="category"] option[value=' + item.FK_category_id + ']').attr('selected', 'selected');
          $('input[name="unit"]').val(item.unit);
          $('input[name="sales_price"]').val(item.sales_price);
          console.log(item);
     })

     $(document).on('submit', '#Raw_Material_Add', function (e) {
          e.preventDefault();
          var formData = new FormData($(this)[0]);

          $.ajax({
               url: base_url + 'Managerawmaterials/addRawMaterial',
               data: formData,
               processData: false,
               contentType: false,
               cache: false,
               type: 'POST',
               success: function (data) {
                    s_alert("Successfully Saved!", "success");
                    table_raw_materials.ajax.reload();
                    $('.add_raw_material_modal').modal('hide');
               }
          });
     });

     $(document).on('click', '#view_Details', function () {
          var id = $(this).data('id');
          $('.view_details_modal').modal('show');
          $('.view_details_modal input').prop('disabled', true);

          $.ajax({
               url: base_url + 'Managerawmaterials/viewDetails',
               type: "post",
               data: { "id": id },
               dataType: 'json',
               success: function (data) {
                    $('.view_details_modal input[name="material_name"]').val(data.material_name);
                    $('.view_details_modal input[name="category"]').val(data.category_name);
                    $('.view_details_modal input[name="unit"]').val(data.unit);
                    $('.view_details_modal input[name="average_cost"]').val(data.average_cost);
                    $('.view_details_modal input[name="sales_price"]').val(data.sales_price);
               }
          });
     });

     $(document).on('click', '#edit_Details', function () {
          var id = $(this).data('id');
          $('.edit_details_modal').modal('show');

          $.ajax({
               url: base_url + 'Managerawmaterials/viewDetails',
               type: "post",
               data: { "id": id },
               dataType: 'json',
               success: function (data) {
                    $('.edit_details_modal input[name="material_name"]').val(data.material_name);
                    $('.edit_details_modal select[name="category"]').val(data.FK_category_id).trigger('change');
                    $('.edit_details_modal input[name="unit"]').val(data.unit);
                    $('.edit_details_modal input[name="average_cost"]').val(data.average_cost);
                    $('.edit_details_modal input[name="sales_price"]').val(data.sales_price);
                    $('.edit_details_modal .edit_Button').attr('data-id', data.PK_raw_materials_id);
               }
          });
     });

     $(document).on('submit', '#Raw_Material_Edit', function (e) {
          e.preventDefault();
          var formData = new FormData($(this)[0]);
          var dataid = $('.edit_details_modal .edit_Button').data('id');
          formData.append('id', dataid)

          $.ajax({
               url: base_url + 'Managerawmaterials/updateDetails',
               data: formData,
               processData: false,
               contentType: false,
               cache: false,
               type: 'POST',
               success: function (data) {
                    s_alert("Successfully Saved!", "success");
                    table_raw_materials.ajax.reload();
                    $('.edit_details_modal').modal('hide');
               }
          });
     });

     var table_raw_materials_cat = $('#raw_Materials_Cat').DataTable({
          "language": { "infoFiltered": "" },
          "processing": true, //Feature control the processing indicator.
          "serverSide": true, //Feature control DataTables' server-side processing mode.
          "responsive": true,
          "order": [[0, 'desc']], //Initial no order.
          "columns": [
               {
                    "data": "PK_category_id", "render": function (data, type, row, meta) {
                         var str = 'CAT-' + row.PK_category_id;
                         return str;
                    }
               },
               { "data": "category_name" },
               { "data": "date_added" },
               {
                    "data": "PK_category_id", "render": function (data, type, row, meta) {
                         var str = '<div class="action-btn-div"><a href="javascript:;" id="edit_Category_Details" data-id="' + row.PK_category_id + '"><i class="fa fa-edit"></i></a>';
                         str += '<a href="javascript:;" id="view_Category_Details" class="text-success"  data-id="' + row.PK_category_id + '"><i class="fa fa-eye"></i></a></div>';
                         return str;
                    }
               },
          ],
          "ajax": {
               "url": base_url + "Managerawmaterials/getCategories",
               "type": "POST"
          },
          "columnDefs": [
               {
                    "targets": [3],
                    "orderable": false,
               },
          ],
     });

    $(document).on('submit', '#Raw_Material_Cat_Add', function (e) {
         e.preventDefault();
         var formData = new FormData($(this)[0]);

         $.ajax({
              url: base_url + 'Managerawmaterials/addCategory',
              data: formData,
              processData: false,
              contentType: false,
              cache: false,
              type: 'POST',
              success: function (data) {
                   s_alert("Successfully Saved!", "success");
                   table_raw_materials_cat.ajax.reload();
                   $('.add_raw_material_cat_modal').modal('hide');
              }
         });
    });

    $(document).on('click', '#view_Category_Details', function () {
         var id = $(this).data('id');
         $('.view_category_details_modal').modal('show');
         $('.view_category_details_modal input').prop('disabled', true);

         $.ajax({
              url: base_url + 'Managerawmaterials/viewCategoryDetails',
              type: "post",
              data: { "id": id },
              dataType: 'json',
              success: function (data) {
                   $('.view_category_details_modal input[name="category_name"]').val(data.category_name);
              }
         });
    });

    $(document).on('click', '#edit_Category_Details', function () {
         var id = $(this).data('id');
         console.log(id);
         $('.edit_category_details_modal').modal('show');

         $.ajax({
              url: base_url + 'Managerawmaterials/viewCategoryDetails',
              type: "post",
              data: { "id": id },
              dataType: 'json',
              success: function (data) {
                   $('.edit_category_details_modal input[name="category_name"]').val(data.category_name);
                   $('.edit_category_details_modal .edit_Button').attr('data-id', data.PK_category_id);
              }
         });
    });

    $(document).on('submit', '#Raw_Material_Cat_Edit', function (e) {
         e.preventDefault();
         var formData = new FormData($(this)[0]);
         var dataid = $('#Raw_Material_Cat_Edit .edit_Button').data('id');
         formData.append('id', dataid)

         $.ajax({
              url: base_url + 'Managerawmaterials/updateCategoryDetails',
              data: formData,
              processData: false,
              contentType: false,
              cache: false,
              type: 'POST',
              success: function (data) {
                   s_alert("Successfully Saved!", "success");
                   table_raw_materials_cat.ajax.reload();
                   $('.edit_category_details_modal').modal('hide');
              }
         });
    });

})
