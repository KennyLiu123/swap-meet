// src/components/VendorProfileForm.js
import React, { useState } from 'react';

export default function VendorProfileForm({ existingProfile, onSave }) {
  // Initialize form state with existing profile or defaults
  const [formData, setFormData] = useState({
    boothName: existingProfile?.boothName || '',
    description: existingProfile?.description || '',
    categories: existingProfile?.categories || [],
    location: existingProfile?.location || { lat: '', lng: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, categories: selected }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSave(formData);
    } catch (err) {
      setError('Failed to save profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <label className="form-label">Booth Name *</label>
        <input
          type="text"
          className="form-control"
          name="boothName"
          value={formData.boothName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Categories</label>
        <select 
          multiple 
          className="form-select" 
          size="4"
          onChange={handleCategoryChange}
          value={formData.categories}
        >
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Collectibles">Collectibles</option>
          <option value="Toys">Toys</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Art">Art</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>
        <div className="form-text">Hold Ctrl/Cmd to select multiple</div>
      </div>
      
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Booth Latitude</label>
          <input
            type="number"
            step="any"
            className="form-control"
            name="lat"
            value={formData.location.lat}
            onChange={handleLocationChange}
            placeholder="34.0522"
          />
        </div>
        <div className="col">
          <label className="form-label">Booth Longitude</label>
          <input
            type="number"
            step="any"
            className="form-control"
            name="lng"
            value={formData.location.lng}
            onChange={handleLocationChange}
            placeholder="-118.2437"
          />
        </div>
      </div>
      <div className="form-text mb-3">
        Get coordinates from <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">Google Maps</a>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}