import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProdiver } from './AppContext';
import App from './App';
import MainLayout from './Layout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <MainLayout>
          <AppProdiver>
            <App />
          </AppProdiver>
        </MainLayout>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
