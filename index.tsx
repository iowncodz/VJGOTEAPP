import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found.");
} else {
  try {
    // Clear initial state
    rootElement.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100vh; color:#F97316; font-family:sans-serif; font-weight:900; letter-spacing:0.2em;">SYSTEM INITIALIZING...</div>';
    
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mounting Failed:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; color: white; background: #1e293b; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: sans-serif;">
        <h2 style="color: #F97316; font-size: 24px; font-weight: 900;">SYSTEM BOOT ERROR</h2>
        <p style="margin-top: 10px; opacity: 0.6; max-width: 400px;">The construction portal failed to load. This usually happens due to a slow connection or an outdated browser.</p>
        <button onclick="window.location.reload()" style="margin-top: 30px; background: #F97316; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em;">
          Retry System Sync
        </button>
      </div>
    `;
  }
}