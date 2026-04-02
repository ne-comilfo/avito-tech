import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';

export const store = configureStore({
    reducer: {
        ads: itemsReducer,
    },
});

// Экспортируем типы для типизации хуков react-redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;