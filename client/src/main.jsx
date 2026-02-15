window.onerror = function (message, source, lineno, colno, error) {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed; top:0; left:0; right:0; padding:20px; background:red; color:white; z-index:9999; font-size:16px; white-space:pre-wrap;';
    el.textContent = `Global Error: ${message}\nAt: ${source}:${lineno}:${colno}\n${error?.stack || ''}`;
    document.body.appendChild(el);
};

import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './services/auth';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

console.log('Mounting App...');

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <BrowserRouter>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </BrowserRouter>
            </ErrorBoundary>
        </React.StrictMode>
    );
    console.log('Mounted App successfully');
} catch (e) {
    console.error('Mount error:', e);
    document.body.innerHTML += `<div style="color:red">MOUNT ERROR: ${e.message}</div>`;
}
