import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardApp } from './components/DashboardApp';
import { CompanionApp } from './components/CompanionApp';
import './styles/index.css';

const query = new URLSearchParams(window.location.search);
const isCompanion = query.get('window') === 'companion';

if (isCompanion) {
  document.documentElement.style.background = 'transparent';
  document.body.style.background = 'transparent';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isCompanion ? <CompanionApp /> : <DashboardApp />}
  </React.StrictMode>
);
