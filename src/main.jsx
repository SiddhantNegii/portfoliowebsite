import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import { ThemeProvider } from './context/themecontext';

// Check localStorage for theme and set html class
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
