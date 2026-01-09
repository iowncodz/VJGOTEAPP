import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    rootElement.innerHTML = '';
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical rendering error:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: white;">Failed to load VJ Gote Portal. Please refresh.</div>`;
  }
}