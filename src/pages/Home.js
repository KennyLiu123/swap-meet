import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1>Swap Meet Navigator</h1>
      <p>Find vendors and items at your local swap meet!</p>
      
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2>Attendees</h2>
              <Link to="/map" className="btn btn-primary mt-3">
                View Map
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2>Vendors</h2>
              <Link to="/dashboard" className="btn btn-success mt-3">
                Vendor Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}