import React, { useState, useEffect } from 'react';
import { storesAPI, inventoryAPI } from '../services/api';
import './Dashboard.css';
import StoreInventory from '../components/StoreInventory';
import QuickStats from '../components/QuickStats';

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchInventory(selectedStore);
    }
  }, [selectedStore]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getAll();
      setStores(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedStore(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (storeId) => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getByStore(storeId);
      setInventory(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Warehouse Dashboard</h1>
      
      <QuickStats inventory={inventory} />

      <div className="dashboard-container">
        <div className="store-selector">
          <label>Select Store:</label>
          <select value={selectedStore || ''} onChange={(e) => setSelectedStore(e.target.value)}>
            <option value="">Choose a store...</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>
                {store.name} ({store.type})
              </option>
            ))}
          </select>
        </div>

        {selectedStore && (
          <StoreInventory storeId={selectedStore} inventory={inventory} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
