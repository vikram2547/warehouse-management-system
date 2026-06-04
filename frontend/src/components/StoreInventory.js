import React from 'react';
import './StoreInventory.css';

const StoreInventory = ({ storeId, inventory }) => {
  return (
    <div className="store-inventory">
      <h2>Inventory</h2>
      
      {inventory.length === 0 ? (
        <p className="no-data">No inventory items</p>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Total Qty</th>
                <th>Available</th>
                <th>Reserved</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item._id} className={item.availableQuantity <= 10 ? 'low-stock' : ''}>
                  <td>{item.product?.name || 'N/A'}</td>
                  <td>{item.product?.sku || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.availableQuantity}</td>
                  <td>{item.reservedQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreInventory;
