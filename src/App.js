// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import VendorDashboard from './pages/VendorDashboard';
import MapView from './pages/MapView';
import VendorPage from './pages/VendorPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import './App.css';

// Private route component for protected routes
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Public route component for authentication pages
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/vendor/:id" element={<VendorPage />} />
              
              {/* Authentication routes (public only) */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              
              {/* Protected routes (vendor dashboard) */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <VendorDashboard />
                </PrivateRoute>
              } />
              
              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <div className="container">
              <p className="text-center mb-0">
                © {new Date().getFullYear()} SwapMeet Navigator • 
                <a href="/privacy" className="ms-2">Privacy</a> • 
                <a href="/terms" className="ms-2">Terms</a>
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;