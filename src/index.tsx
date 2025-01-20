import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { CacheProvider } from './context/CacheContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <CacheProvider>
        <App />
      </CacheProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();