import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ItemsPagination.scss';

interface ItemsPaginationProps {
    page: number;
    totalPages: number;
    isLoading: boolean;
    setPage: (page: number | ((p: number) => number)) => void;
}

export default function ItemsPagination({ page, totalPages, isLoading, setPage }: ItemsPaginationProps) {
    // Если страниц нет или она всего 1, можно вообще не рендерить пагинацию
    if (totalPages <= 1) return null;

    return (
        <div className="ads__pagination">
            <button
                className={`ads__page-btn ${page === 1 ? 'ads__page-btn--blocked' : ''}`}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
            >
                <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                    key={pageNum}
                    className={`ads__page-btn ${page === pageNum ? 'ads__page-btn--active' : ''}`}
                    onClick={() => setPage(pageNum)}
                    disabled={isLoading}
                >
                    {pageNum}
                </button>
            ))}

            <button
                className={`ads__page-btn ${page === totalPages ? 'ads__page-btn--blocked' : ''}`}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}