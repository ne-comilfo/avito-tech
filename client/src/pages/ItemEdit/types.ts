export interface ItemData {
    id: number;
    title: string;
    description?: string;
    price: number | null;
    category: string;
    createdAt: string;
    updatedAt: string;
    needsRevision: boolean;
    params?: Record<string, any>;
}

export type ToastType = 'success' | 'error' | null;

export interface ToastState {
    type: ToastType;
    text: string;
}

export interface FormValues {
    title: string;
    price: string;
    category: string;
    description: string;
    params: Record<string, string>;
}

export type AIStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AIState {
    status: AIStatus;
    result: string | null;
}