import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchItems, setSort, setViewMode } from '../../store/itemsSlice';
import { LayoutGrid, List } from 'lucide-react';

import ItemsSearch from './components/ItemsSearch/ItemsSearch';
import ItemsFilters from './components/ItemsFilters/ItemsFilters';
import ItemsGrid from './components/ItemsGrid/ItemsGrid';
import ItemsPagination from './components/ItemsPagination/ItemsPagination';

import './ItemsPage.scss';

function ItemsPage() {
    const dispatch = useDispatch<AppDispatch>();

    const { total, viewMode } = useSelector((state: RootState) => state.ads);
    const { searchQuery, page, selectedCategories, needsRevision, sort } =
        useSelector((state: RootState) => state.ads.filters);

    const limit = 10;

    useEffect(() => {
        const skip = (page - 1) * limit;
        const [column, direction] = sort.split('-');

        const promise = dispatch(
            fetchItems({
                skip,
                limit,
                q: searchQuery,
                categories: selectedCategories.join(','),
                needsRevision: needsRevision ? 'true' : undefined,
                sortColumn: column,
                sortDirection: direction,
            }),
        );

        return () => {
            promise.abort();
        };
    }, [dispatch, page, searchQuery, selectedCategories, needsRevision, sort]);

    return (
        <div className="wrapper">
            <div className="ads">
                <div className="ads__header">
                    <h1 className="ads__title">Мои объявления</h1>
                    <span className="ads__count">{total} объявлений</span>
                </div>

                <div className="ads__controls">
                    <ItemsSearch />

                    <div className="ads__view">
                        <button
                            className={`ads__view-btn ${viewMode === 'grid' ? 'ads__view-btn--active' : ''}`}
                            onClick={() => dispatch(setViewMode('grid'))}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <div className="ads__divider"></div>
                        <button
                            className={`ads__view-btn ${viewMode === 'list' ? 'ads__view-btn--active' : ''}`}
                            onClick={() => dispatch(setViewMode('list'))}
                        >
                            <List size={20} />
                        </button>
                    </div>

                    <select
                        className="ads__sort"
                        value={sort}
                        onChange={(e) => dispatch(setSort(e.target.value))}
                    >
                        <option value="createdAt-desc">
                            По новизне (сначала новые)
                        </option>
                        <option value="createdAt-asc">
                            По новизне (сначала старые)
                        </option>

                        <option value="title-asc">По названию (А → Я)</option>
                        <option value="title-desc">По названию (Я → А)</option>

                        <option value="price-asc">По цене (дешевле)</option>
                        <option value="price-desc">По цене (дороже)</option>
                    </select>
                </div>

                <div className="ads__content">
                    <aside className="ads__sidebar">
                        <ItemsFilters />
                    </aside>

                    <div className="ads__right">
                        <ItemsGrid />
                        <ItemsPagination />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemsPage;
