export type Category = 'auto' | 'real_estate' | 'electronics';

export interface AdItem {
    id: string | number;
    category: Category;
    title: string;
    price: number;
    description?: string;
    needsRevision: boolean;
    params: Record<string, string | number>;
    createdAt: string;
    updatedAt: string;
}

export interface FetchItemsResponse {
    items: AdItem[];
    total: number;
}

export interface FetchItemsParams {
    limit?: number;
    skip?: number;
    q?: string;
    categories?: string;
    needsRevision?: string;
    sortColumn?: string;
    sortDirection?: string;
}
