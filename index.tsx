import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found.");
} else {
  try {
    // Show immediate progress
    rootElement.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100vh; color:#F97316; font-weight:bold;">INITIALIZING VJ GOTE ENGINE...</div>';
    
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mounting Failed:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; color: white; background: #1e293b; height: 100vh;">
        <h2 style="color: #F97316; font-size: 24px; font-weight: 900;">SYSTEM BOOT ERROR</h2>
        <p style="margin-top: 10px; opacity: 0.6;">The browser failed to initialize the construction portal modules.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #F97316; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
          RETRY SYSTEM SYNC
        </button>
      </div>
    `;
  }
}