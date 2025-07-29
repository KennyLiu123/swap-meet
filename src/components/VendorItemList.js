import React from 'react';

export default function VendorItemList({ items, onMarkSold }) {
  return (
    <div className="mt-4">
      <h2>Your Items</h2>
      
      {items.length === 0 ? (
        <div className="alert alert-info">You haven't added any items yet</div>
      ) : (
        <div className="row">
          {items.map(item => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div className="card">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    className="card-img-top" 
                    alt={item.name}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">${item.price.toFixed(2)}</p>
                  {item.sold ? (
                    <span className="badge bg-danger">Sold</span>
                  ) : (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onMarkSold(item.id)}
                    >
                      Mark as Sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}