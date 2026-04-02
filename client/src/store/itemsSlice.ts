import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import type { AdItem, FetchItemsResponse, FetchItemsParams } from '../types';

interface ItemsState {
    items: AdItem[];
    total: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: ItemsState = {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
};

export const fetchItems = createAsyncThunk<
    FetchItemsResponse,
    FetchItemsParams,
    { rejectValue: string }
>('items/fetchItems', async (params, { signal, rejectWithValue }) => {
    try {
        const response = await api.get<FetchItemsResponse>('/items', {
            params,
            signal,
        });
        return response.data;
    } catch (error: any) {
        if (error.name === 'CanceledError') {
            return rejectWithValue('Запрос был отменен');
        }
        return rejectWithValue(error.message || 'Ошибка сервера');
    }
});

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchItems.fulfilled,
                (state, action: PayloadAction<FetchItemsResponse>) => {
                    state.isLoading = false;
                    state.items = action.payload.items;
                    state.total = action.payload.total;
                },
            )
            .addCase(fetchItems.rejected, (state, action) => {
                state.isLoading = false;
                if (action.payload !== 'Запрос был отменен') {
                    state.error = action.payload as string;
                }
            });
    },
});

export default itemsSlice.reducer;
