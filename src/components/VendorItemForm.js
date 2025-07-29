import React, { useState } from 'react';

export default function VendorItemForm({ onAddItem }) {
  const [item, setItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '' // Now storing URL string instead of file object
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      onAddItem({
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category,
        imageUrl: item.imageUrl  // Use URL directly
      });

      // Reset form
      setItem({ 
        name: '', 
        description: '', 
        price: '', 
        category: '', 
        imageUrl: '' 
      });
    } catch (error) {
      console.error("Error adding item: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={item.name}
              onChange={handleChange}
              required
              placeholder="Vintage Lamp"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              name="description"
              value={item.description}
              onChange={handleChange}
              required
              placeholder="Describe your item..."
              rows="3"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              name="price"
              value={item.price}
              onChange={handleChange}
              required
              placeholder="15.99"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              name="category"
              value={item.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
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
          </div>
          
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-control"
              name="imageUrl"
              value={item.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              pattern="https?://.+" 
              title="Include http:// or https://"
            />
            <div className="form-text">
              Tip: Use free image hosts like{" "}
              <a href="https://imgbb.com/" target="_blank" rel="noreferrer">
                ImgBB
              </a>{" "}
              or{" "}
              <a href="https://postimages.org/" target="_blank" rel="noreferrer">
                PostImages
              </a>
            </div>
          </div>
          
          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding Item...' : 'Add Item to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}