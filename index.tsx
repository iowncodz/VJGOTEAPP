
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// This ensures that when the script runs and React takes over, 
// the manual loading screen from index.html is removed.
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  // We use a small delay to prevent a white flash before React is fully ready
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 100);
}
