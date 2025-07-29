// src/pages/MapView.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default coordinates (Los Angeles swap meet)
const DEFAULT_COORDS = [34.0522, -118.2437];

export default function MapView() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState(DEFAULT_COORDS);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vendors'));
        const vendorsData = [];
        
        querySnapshot.forEach(doc => {
          const vendor = doc.data();
          // Only show vendors with valid location
          if (vendor.location?.lat && vendor.location?.lng) {
            vendorsData.push({
              id: doc.id,
              ...vendor
            });
          }
        });
        
        setVendors(vendorsData);
        
        // Center map on first vendor if available
        if (vendorsData.length > 0) {
          setMapCenter([
            vendorsData[0].location.lat, 
            vendorsData[0].location.lng
          ]);
        }
        
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
        <p className="mt-2">Loading swap meet map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container" style={{ height: 'calc(100vh - 56px)' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {vendors.length === 0 ? (
          <Marker position={mapCenter}>
            <Popup>
              No vendors found at this location.<br />
              Be the first to register!
            </Popup>
          </Marker>
        ) : (
          vendors.map(vendor => (
            <Marker 
              key={vendor.id} 
              position={[vendor.location.lat, vendor.location.lng]}
            >
              <Popup>
                <div>
                  <h5 className="mb-1">{vendor.boothName || 'Unnamed Booth'}</h5>
                  <p className="mb-1 text-muted">
                    {vendor.categories?.slice(0, 3).join(', ') || 'Various items'}
                  </p>
                  <Link 
                    to={`/vendor/${vendor.id}`} 
                    className="btn btn-sm btn-primary mt-1"
                  >
                    View Items
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
      
      <div className="map-overlay p-2 bg-light border-top">
        <div className="container">
          <p className="mb-0 text-center">
            <strong>{vendors.length}</strong> vendor{vendors.length !== 1 ? 's' : ''} at this swap meet
          </p>
        </div>
      </div>
    </div>
  );
}