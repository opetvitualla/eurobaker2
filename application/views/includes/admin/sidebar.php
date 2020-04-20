<aside class="left-sidebar mini-side">
    <!-- Sidebar scroll-->
    <div class="scroll-sidebar">
        <!-- Sidebar navigation-->
        <nav class="sidebar-nav">
            <ul id="sidebarnav">

                <li> <a class="waves-effect waves-dark" href="<?= base_url('Managepurchaseorders') ?>" aria-expanded="false"><i class="icon-Remove-Cart "></i><span class="hide-menu">Purchase Order</span></a>
                </li>
                <li> <a class="waves-effect waves-dark" href="<?= base_url('Managesuppliers/') ?>" aria-expanded="false"><i class="icon-Truck"></i><span class="hide-menu">Supplier</span></a>
                </li>
                <li> <a class="waves-effect waves-dark" href="<?= base_url('Managerawmaterials/') ?>" aria-expanded="false"><i class="icon-Bag-Items"></i><span class="hide-menu">Raw Materials</span></a>
                </li>
                <li> <a class="waves-effect waves-dark" href="<?= base_url('Manageiteminventory/') ?>" aria-expanded="false"><i class="icon-Bar-Chart  "></i><span class="hide-menu">Item Inventory </span></a>
                </li>
                <li> <a class="has-arrow waves-effect waves-dark" href="#" aria-expanded="false"><i class="icon-Warehouse "></i><span class="hide-menu">Manage Stocks</span></a>
                    <ul aria-expanded="false" class="collapse">
                        <li><a href="<?= base_url('Managestocks/StockTransfer') ?>">Stock Transfer</a></li>
                        <li><a href="<?= base_url('Stockout') ?>">Stock Out</a></li>
                        <li><a href="<?= base_url('Managestocks/StockAdjustments') ?>">Stock Adjustment</a></li>
                    </ul>
                </li>
                <li> <a class="has-arrow waves-effect waves-dark" href="#" aria-expanded="false"><i class="icon-File-HorizontalText "></i><span class="hide-menu">Reports</span></a>
                    <ul aria-expanded="false" class="collapse">
                        <li><a href="<?= base_url('total_purchase_order') ?>">Total Purchases</a></li>
                        <li><a href="#">Total Used/Stock Out</a></li>
                       <li><a href="<?= base_url('Managereports/PendingDeliveries') ?>">Pending Deliveries</a></li>
                        <li><a href="<?= base_url('Managereports/EndingInventory') ?>">Ending Inventory</a></li>
                        <li><a href="<?= base_url('Managereports/StockForTransfer') ?>">Stock Transfer</a></li>
                        <li><a href="#">Descripancies</a></li>
                    </ul>
                </li>

            </ul>
        </nav>
        <!-- End Sidebar navigation -->
    </div>
    <!-- End Sidebar scroll-->
</aside>
