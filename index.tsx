
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render VJ Gote Portal:", error);
  rootElement.innerHTML = `
    <div style="color: white; background: #1E293B; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;">
      <div>
        <h1 style="color: #F97316;">Initialization Error</h1>
        <p>Please check your internet connection and refresh.</p>
      </div>
    </div>
  `;
}
