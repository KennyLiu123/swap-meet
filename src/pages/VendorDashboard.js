// src/pages/VendorDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import VendorItemForm from '../components/VendorItemForm';
import VendorItemList from '../components/VendorItemList';
import VendorProfileForm from '../components/VendorProfileForm';
import { useNavigate } from 'react-router-dom';

export default function VendorDashboard() {
  const { currentUser, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch vendor data
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch vendor profile
        const profileQuery = query(
          collection(db, 'vendors'), 
          where('userId', '==', currentUser.uid)
        );
        
        const profileSnapshot = await getDocs(profileQuery);
        if (!profileSnapshot.empty) {
          const profileDoc = profileSnapshot.docs[0];
          setVendorProfile({
            id: profileDoc.id,
            ...profileDoc.data()
          });
        }

        // Fetch vendor items
        const itemsQuery = query(
          collection(db, 'items'), 
          where('vendorId', '==', currentUser.uid)
        );
        
        const itemsSnapshot = await getDocs(itemsQuery);
        setItems(itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError('Failed to load your data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  // Add new item
  const handleAddItem = async (item) => {
    try {
      const newItem = {
        ...item,
        vendorId: currentUser.uid,
        createdAt: new Date(),
        sold: false
      };
      
      const docRef = await addDoc(collection(db, 'items'), newItem);
      setItems(prev => [...prev, { id: docRef.id, ...newItem }]);
      return true;
    } catch (err) {
      console.error("Error adding item:", err);
      setError('Failed to add item. Please try again.');
      return false;
    }
  };

  // Mark item as sold
  const handleMarkSold = async (itemId) => {
    try {
      await updateDoc(doc(db, 'items', itemId), { sold: true });
      setItems(prev => 
        prev.map(item => item.id === itemId ? { ...item, sold: true } : item)
      );
    } catch (err) {
      console.error("Error marking item as sold:", err);
      setError('Failed to update item status.');
    }
  };

  // Update vendor profile
  const handleProfileUpdate = async (profileData) => {
    try {
      // If profile exists, update it
      if (vendorProfile) {
        await updateDoc(doc(db, 'vendors', vendorProfile.id), profileData);
        setVendorProfile(prev => ({ ...prev, ...profileData }));
      } 
      // Otherwise create new profile
      else {
        const newProfile = {
          ...profileData,
          userId: currentUser.uid,
          createdAt: new Date()
        };
        
        const docRef = await addDoc(collection(db, 'vendors'), newProfile);
        setVendorProfile({ id: docRef.id, ...newProfile });
      }
      
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('Failed to save profile. Please try again.');
      return false;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your vendor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Vendor Dashboard</h1>
        <button 
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Your Booth Profile</h2>
          
          {vendorProfile ? (
            <div>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1"><strong>Booth Name:</strong> {vendorProfile.boothName}</p>
                  <p className="mb-1"><strong>Description:</strong> {vendorProfile.description}</p>
                  <p className="mb-0"><strong>Categories:</strong> {vendorProfile.categories?.join(', ') || 'None'}</p>
                </div>
                <div>
                  {vendorProfile.location ? (
                    <span className="badge bg-success">
                      Map Position Set
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Needs Map Position
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              You haven't set up your booth profile yet. Customers won't be able to find you!
            </div>
          )}
          
          <div className="mt-3">
            <VendorProfileForm 
              existingProfile={vendorProfile} 
              onSave={handleProfileUpdate} 
            />
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Your Inventory</h2>
              <p className="card-subtitle mb-3 text-muted">
                Add items you're selling at the swap meet
              </p>
              
              <VendorItemForm onAddItem={handleAddItem} />
              <VendorItemList 
                items={items} 
                onMarkSold={handleMarkSold} 
              />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Stats</h3>
              
              <div className="d-flex justify-content-around text-center mb-3">
                <div>
                  <h4 className="text-primary">{items.length}</h4>
                  <p className="mb-0 text-muted">Total Items</p>
                </div>
                <div>
                  <h4 className="text-success">
                    {items.filter(item => !item.sold).length}
                  </h4>
                  <p className="mb-0 text-muted">Available</p>
                </div>
                <div>
                  <h4 className="text-danger">
                    {items.filter(item => item.sold).length}
                  </h4>
                  <p className="mb-0 text-muted">Sold</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3>Tips</h3>
                <ul>
                  <li>Add clear photos to attract buyers</li>
                  <li>Mark sold items to keep inventory updated</li>
                  <li>Set your booth location on the map</li>
                  <li>Check back regularly for new features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}