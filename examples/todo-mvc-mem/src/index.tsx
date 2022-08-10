import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const container = document.getElementById('container');
if (container == null) {
  throw new Error();
}
const root = createRoot(container);
root.render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <App />
  </React.Suspense>,
);
