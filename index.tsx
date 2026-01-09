
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  // Clear any existing HTML content (like old loaders) before React takes over
  rootElement.innerHTML = '';
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
