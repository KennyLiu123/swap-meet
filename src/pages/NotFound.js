import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">404</h1>
      <p className="lead">Page Not Found</p>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <div className="mt-4">
        <Link to="/" className="btn btn-primary me-2">Go Home</Link>
        <Link to="/map" className="btn btn-outline-primary">View Map</Link>
      </div>
    </div>
  );
}