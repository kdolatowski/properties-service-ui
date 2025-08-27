import './App.css';

import getRequestConfig, { apiRequest } from './services/api-config';

import { HttpMethod } from './services/api-service';
import PageLayout from './components/shared/PageLayout.component';
import React from 'react';

function App() {
  return (
    <PageLayout />
  );
}

export default App;
