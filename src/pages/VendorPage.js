import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function VendorPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      // Get vendor profile
      const vendorDoc = await getDoc(doc(db, 'vendors', id));
      if (vendorDoc.exists()) {
        setVendor(vendorDoc.data());
        
        // Get vendor items
        const itemsQuery = query(
          collection(db, 'items'), 
          where('vendorId', '==', vendorDoc.data().userId)
        );
        
        const itemsSnapshot = await getDocs(itemsQuery);
        setItems(itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      setLoading(false);
    };

    fetchVendorData();
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!vendor) return <div className="container mt-4">Vendor not found</div>;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h1>{vendor.boothName}</h1>
          <p className="lead">{vendor.description}</p>
          <p>
            <strong>Categories:</strong> {vendor.categories?.join(', ') || 'N/A'}
          </p>
        </div>
      </div>

      <h2>Available Items</h2>
      <div className="row">
        {items.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">No items listed yet</div>
          </div>
        ) : (
          items.map(item => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    className="card-img-top" 
                    alt={item.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="fw-bold">${item.price.toFixed(2)}</p>
                  {item.sold && (
                    <span className="badge bg-danger">Sold</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}