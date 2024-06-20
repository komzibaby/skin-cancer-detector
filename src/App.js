// src/App.js
import React from 'react';
import ImageUpload from './ImageUpload';

import { CssBaseline } from '@mui/material';
import { styled } from '@mui/system';

const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const App = () => {
  return (
    <AppContainer>
      <CssBaseline />
      <ImageUpload />
      <ter /> {/* Include the Footer component */}
    </AppContainer>
  );
};

export default App;