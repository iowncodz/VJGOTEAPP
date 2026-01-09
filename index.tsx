import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element not found in the DOM.");
} else {
  try {
    rootElement.innerHTML = '';
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    rootElement.innerHTML = `<div style="padding: 40px; text-align: center; color: white;">
      <h2 style="color: #F97316;">Portal Load Failed</h2>
      <p>Error initializing application modules. Please check your browser connection.</p>
    </div>`;
  }
}