import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import type { AdItem, FetchItemsResponse, FetchItemsParams } from '../types';

interface ItemsState {
    items: AdItem[];
    total: number;
    isLoading: boolean;
    error: string | null;
    viewMode: 'grid' | 'list';
    filters: {
        searchQuery: string;
        page: number;
        selectedCategories: string[];
        needsRevision: boolean;
        sort: string;
    };
}

const initialState: ItemsState = {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
    viewMode: 'grid',
    filters: {
        searchQuery: '',
        page: 1,
        selectedCategories: [],
        needsRevision: false,
        sort: 'createdAt-desc',
    },
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
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return rejectWithValue(errorMessage);
    }
});

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.searchQuery = action.payload;
            state.filters.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
            state.viewMode = action.payload;
        },
        toggleCategory: (state, action: PayloadAction<string>) => {
            const category = action.payload;
            if (state.filters.selectedCategories.includes(category)) {
                state.filters.selectedCategories =
                    state.filters.selectedCategories.filter(
                        (c) => c !== category,
                    );
            } else {
                state.filters.selectedCategories.push(category);
            }
            state.filters.page = 1;
        },
        setNeedsRevision: (state, action: PayloadAction<boolean>) => {
            state.filters.needsRevision = action.payload;
            state.filters.page = 1;
        },
        setSort: (state, action: PayloadAction<string>) => {
            state.filters.sort = action.payload;
            state.filters.page = 1;
        },
        resetFilters: (state) => {
            state.filters.selectedCategories = [];
            state.filters.needsRevision = false;
            state.filters.page = 1;
        },
    },
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

export const {
    setViewMode,
    setSearchQuery,
    setPage,
    toggleCategory,
    setNeedsRevision,
    setSort,
    resetFilters,
} = itemsSlice.actions;
export default itemsSlice.reducer;
