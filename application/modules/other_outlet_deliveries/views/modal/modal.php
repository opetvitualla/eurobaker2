<div class="modal fade new_deliver_modal" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" style="max-width:900px;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">New delivery form</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="other_deliveries_form" action="#" method="POST">
                    <div class="form-body">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <label class="fbold" for="supplier">Purchase Order No:</label>
                                    <select name="supplier" class="po_select form-control" style="width: 100%;">
                                    <optgroup label="Select PO">
                                       
                                    </optgroup>
                                </select>

                                </div>
                                <div class="col-md-12">
                                    <hr> </div>
                            </div>
                            <div class="cont-po">

                                <table class="table table-bordered po-table">
                                    <thead>
                                        <tr>
                                            <td>Item Name</td>
                                            <td>Quantity</td>
                                            <td style="width: 122px;">Item Unit</td>
                                            <td>Price</td>
                                            <td>Total</td>
                                            <td>Received Qty.</td>
                                        </tr>
                                    </thead>
                                    <tbody class="table-po-body-other"> </tbody>
                                </table>
                                <div class="form-actions mt-4">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <h3 class="fbold o-total">Total Items: <span class="total-item">0</span></h3>

                                            <h3 class="fbold o-total">Overall Total: <span>&#8369;</span><span class="over-total">0</span></h3>
                                            
                                        </div>
                                        <div class="col-md-7">
                                            <label for="" class="fbold">Discrepancy Reason: </label>
                                            <textarea id="discrepancy_reason" name="discrepancy_reason" class="form-control"></textarea>
                                        </div>
                                    </div>
                                    <div class="card-body text-right ">
                                        <button type="submit" class="btn btn-success"> Submit </button>
                                    </div>
                                    <hr>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>