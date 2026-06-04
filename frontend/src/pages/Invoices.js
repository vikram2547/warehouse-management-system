import React, { useState, useEffect } from 'react';
import { invoicesAPI, storesAPI } from '../services/api';
import './Invoices.css';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    store: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ product: '', quantity: 0, unitPrice: 0, totalPrice: 0 }],
    tax: 0,
    remarks: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchStores();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoicesAPI.getAll();
      setInvoices(response.data.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
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
      await invoicesAPI.create(formData);
      setFormData({
        store: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        items: [{ product: '', quantity: 0, unitPrice: 0, totalPrice: 0 }],
        tax: 0,
        remarks: ''
      });
      setShowForm(false);
      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusChange = async (invoiceId, newStatus) => {
    try {
      setLoading(true);
      await invoicesAPI.updatePayment(invoiceId, { paymentStatus: newStatus });
      fetchInvoices();
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Paid': '#28a745',
      'Pending': '#ffc107',
      'Partial': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1>Sales Invoices</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'New Invoice'}
        </button>
      </div>

      {showForm && (
        <form className="invoice-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Store:</label>
              <select 
                value={formData.store} 
                onChange={(e) => setFormData({...formData, store: e.target.value})}
                required
              >
                <option value="">Select store</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Customer Name:</label>
              <input 
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input 
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tax (%):</label>
            <input 
              type="number"
              value={formData.tax}
              onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Remarks:</label>
            <textarea 
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              placeholder="Add any notes about this invoice"
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="no-data">No invoices found</p>
      ) : (
        <div className="invoices-table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Store</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Payment Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerName}</td>
                  <td>{invoice.store?.name}</td>
                  <td>₹{invoice.subtotal?.toLocaleString()}</td>
                  <td>₹{invoice.tax?.toLocaleString()}</td>
                  <td className="total-col">₹{invoice.totalAmount?.toLocaleString()}</td>
                  <td>
                    <select 
                      value={invoice.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(invoice._id, e.target.value)}
                      style={{backgroundColor: getStatusColor(invoice.paymentStatus)}}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-info">View</button>
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

export default Invoices;
