import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { register } from './serviceWorkerRegistration'; // ✅ add this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

register(); 