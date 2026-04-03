import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../../../../store/itemsSlice';
import type { AppDispatch, RootState } from '../../../../store/store';
import './ItemsSearch.scss';

export default function ItemsSearch() {
    const dispatch = useDispatch<AppDispatch>();
    const { searchQuery } = useSelector(
        (state: RootState) => state.ads.filters,
    );

    return (
        <div className="search">
            <input
                className="search__input"
                placeholder="Найти объявление..."
                type="search"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
            <button className="search__btn">
                <Search size={14} />
            </button>
        </div>
    );
}
