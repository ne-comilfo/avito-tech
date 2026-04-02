import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchItems } from '../../store/itemsSlice';
import { LayoutGrid, List } from 'lucide-react';

import ItemsSearch from '../../components/ItemsPage/ItemsSearch/ItemsSearch';
import ItemsFilters from '../../components/ItemsPage/ItemsFilters/ItemsFilters';
import ItemsGrid from '../../components/ItemsPage/ItemsGrid/ItemsGrid';
import ItemsPagination from '../../components/ItemsPage/ItemsPagination/ItemsPagination';

import './ItemsPage.scss';

function ItemsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [needsRevision, setNeedsRevision] = useState<boolean>(false);
    const [sort, setSort] = useState('createdAt-desc');

    const { items, isLoading, error, total } = useSelector(
        (state: RootState) => state.ads,
    );

    const limit = 10;
    const totalPages = Math.ceil(total / limit);

    const handleBadgeChange = (value: boolean) => {
        setNeedsRevision(value);
        setPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category],
        );
        setPage(1);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setNeedsRevision(false);
        setPage(1);
    };

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
                    <ItemsSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />

                    <div className="ads__view">
                        <LayoutGrid size={20} color="#1890FF" />
                        <div className="ads__divider"></div>
                        <List size={20} />
                    </div>

                    <select
                        className="ads__sort"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
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
                        <ItemsFilters
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                            needsRevision={needsRevision}
                            onRevisionChange={handleBadgeChange}
                            onReset={handleResetFilters}
                        />
                    </aside>

                    <div className="ads__right">
                        <ItemsGrid
                            items={items}
                            isLoading={isLoading}
                            error={error}
                        />

                        <ItemsPagination
                            page={page}
                            totalPages={totalPages}
                            isLoading={isLoading}
                            setPage={setPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemsPage;
