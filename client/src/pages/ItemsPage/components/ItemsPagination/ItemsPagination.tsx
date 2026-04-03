import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../../../../store/itemsSlice';
import type { AppDispatch, RootState } from '../../../../store/store';
import './ItemsPagination.scss';

export default function ItemsPagination() {
    const dispatch = useDispatch<AppDispatch>();
    const { total, isLoading, filters } = useSelector(
        (state: RootState) => state.ads,
    );
    const { page } = filters;

    const limit = 10;
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    return (
        <div className="ads__pagination">
            <button
                className={`ads__page-btn ${page === 1 ? 'ads__page-btn--blocked' : ''}`}
                onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
                disabled={page === 1 || isLoading}
            >
                <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                    <button
                        key={pageNum}
                        className={`ads__page-btn ${page === pageNum ? 'ads__page-btn--active' : ''}`}
                        onClick={() => dispatch(setPage(pageNum))}
                        disabled={isLoading}
                    >
                        {pageNum}
                    </button>
                ),
            )}

            <button
                className={`ads__page-btn ${page === totalPages ? 'ads__page-btn--blocked' : ''}`}
                onClick={() =>
                    dispatch(setPage(Math.min(totalPages, page + 1)))
                }
                disabled={page === totalPages || isLoading}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
