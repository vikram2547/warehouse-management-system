import React, { useState, useEffect } from 'react';
import { transfersAPI, storesAPI, inventoryAPI } from '../services/api';
import './Transfers.css';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromStore: '',
    toStore: '',
    items: [{ product: '', quantity: 0, unitPrice: 0, totalPrice: 0 }],
    remarks: ''
  });

  useEffect(() => {
    fetchTransfers();
    fetchStores();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await transfersAPI.getAll();
      setTransfers(response.data.data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await storesAPI.getAll();
      setStores(response.data.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await transfersAPI.create(formData);
      setFormData({
        fromStore: '',
        toStore: '',
        items: [{ product: '', quantity: 0, unitPrice: 0, totalPrice: 0 }],
        remarks: ''
      });
      setShowForm(false);
      fetchTransfers();
    } catch (error) {
      console.error('Error creating transfer:', error);
      alert('Error creating transfer: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transferId, action) => {
    try {
      setLoading(true);
      if (action === 'approve') {
        await transfersAPI.approve(transferId);
      } else if (action === 'receive') {
        await transfersAPI.receive(transferId);
      } else if (action === 'cancel') {
        await transfersAPI.cancel(transferId);
      }
      fetchTransfers();
    } catch (error) {
      console.error('Error updating transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'In Transit': '#17a2b8',
      'Received': '#28a745',
      'Cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="transfers-page">
      <div className="page-header">
        <h1>Stock Transfers</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'New Transfer'}
        </button>
      </div>

      {showForm && (
        <form className="transfer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>From Store:</label>
            <select 
              value={formData.fromStore} 
              onChange={(e) => setFormData({...formData, fromStore: e.target.value})}
              required
            >
              <option value="">Select source store</option>
              {stores.map(store => (
                <option key={store._id} value={store._id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>To Store:</label>
            <select 
              value={formData.toStore} 
              onChange={(e) => setFormData({...formData, toStore: e.target.value})}
              required
            >
              <option value="">Select destination store</option>
              {stores.map(store => (
                <option key={store._id} value={store._id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Remarks:</label>
            <textarea 
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              placeholder="Add any notes about this transfer"
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creating...' : 'Create Transfer'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : transfers.length === 0 ? (
        <p className="no-data">No transfers found</p>
      ) : (
        <div className="transfers-table-wrapper">
          <table className="transfers-table">
            <thead>
              <tr>
                <th>Transfer #</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(transfer => (
                <tr key={transfer._id}>
                  <td>{transfer.transferNumber}</td>
                  <td>{transfer.fromStore?.name}</td>
                  <td>{transfer.toStore?.name}</td>
                  <td>₹{transfer.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span className="status-badge" style={{backgroundColor: getStatusColor(transfer.status)}}>
                      {transfer.status}
                    </span>
                  </td>
                  <td>{new Date(transfer.transferDate).toLocaleDateString()}</td>
                  <td>
                    {transfer.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(transfer._id, 'approve')}
                          className="btn btn-sm btn-info"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(transfer._id, 'cancel')}
                          className="btn btn-sm btn-danger"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {transfer.status === 'In Transit' && (
                      <button 
                        onClick={() => handleStatusChange(transfer._id, 'receive')}
                        className="btn btn-sm btn-success"
                      >
                        Receive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transfers;
