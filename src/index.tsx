import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { CacheProvider } from './context/CacheContext';
import { RootDirectoriesProvider } from './context/RootDirectoriesContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <CacheProvider>
        {/* Wrap in our RootDirectoriesProvider */}
        <RootDirectoriesProvider>
          <App />
        </RootDirectoriesProvider>
      </CacheProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();