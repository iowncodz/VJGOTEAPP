// @ts-ignore
const React = window.React;
// @ts-ignore
const ReactDOM = window.ReactDOM;

import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      React.createElement(React.StrictMode, null, 
        React.createElement(App)
      )
    );
  } catch (e) {
    console.error("Render error:", e);
    container.innerHTML = `<div style="color:white; text-align:center; padding:50px;">
      <h1 style="color:#F97316">BOOT ERROR</h1>
      <p>System failed to initialize. Please refresh.</p>
    </div>`;
  }
}