import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Google OAuth provider import
import { GoogleOAuthProvider } from '@react-oauth/google';

// React 18 root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap App with GoogleOAuthProvider
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="105149798415-0b8s1bet2k0c2uce5ga4rifdmp04s572.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);