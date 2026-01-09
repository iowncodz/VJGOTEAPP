
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// We define a function to hide the loader that only runs after the browser has finished painting the React UI
const hideLoader = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 300);
  }
};

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Use requestAnimationFrame to wait until React has at least started the mounting process
  requestAnimationFrame(() => {
    // Small extra buffer to ensure the 'App' components initial render (loading state) is visible
    setTimeout(hideLoader, 500);
  });
} catch (error) {
  console.error("Failed to render VJ Gote Portal:", error);
  // Fix: Cast Element to HTMLElement to access style property
  const loadingText = document.querySelector('#loading-screen p') as HTMLElement | null;
  if (loadingText) {
    loadingText.textContent = "Initialization Error. Check Console.";
    loadingText.style.color = "#ef4444";
  }
}
