import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App.tsx';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </MantineProvider>
    </StrictMode>,
);
