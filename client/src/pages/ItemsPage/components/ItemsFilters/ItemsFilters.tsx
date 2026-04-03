import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Switch } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleCategory,
    setNeedsRevision,
    resetFilters,
} from '../../../../store/itemsSlice';
import type { AppDispatch, RootState } from '../../../../store/store';
import './ItemsFilters.scss';

export default function ItemsFilters() {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedCategories, needsRevision } = useSelector(
        (state: RootState) => state.ads.filters,
    );

    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

    return (
        <>
            <div className="filters">
                <h3 className="filters__title">Фильтры</h3>

                <div
                    className={`filters__block ${isCategoriesOpen ? 'filters__block--open' : ''}`}
                >
                    <div
                        className="filters__header"
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                        <div className="filters__subtitle">Категория</div>
                        <div className="filters__expand">
                            <button className="filters__expand-btn">
                                <ChevronUp size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="filters__collapse-wrapper">
                        <div className="filters__items">
                            <label className="filters__item">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                        'auto',
                                    )}
                                    onChange={() =>
                                        dispatch(toggleCategory('auto'))
                                    }
                                />
                                Авто
                            </label>
                            <label className="filters__item">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                        'electronics',
                                    )}
                                    onChange={() =>
                                        dispatch(toggleCategory('electronics'))
                                    }
                                />
                                Электроника
                            </label>
                            <label className="filters__item">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                        'real_estate',
                                    )}
                                    onChange={() =>
                                        dispatch(toggleCategory('real_estate'))
                                    }
                                />
                                Недвижимость
                            </label>
                        </div>
                    </div>
                    <div className="filters__divider"></div>
                    <label className="filters__item">
                        <Switch
                            checked={needsRevision}
                            onChange={(event) =>
                                dispatch(
                                    setNeedsRevision(
                                        event.currentTarget.checked,
                                    ),
                                )
                            }
                            label="Только требующие доработок"
                            labelPosition="left"
                        />
                    </label>
                </div>
            </div>
            <div className="filters__reset">
                <button
                    className="filters__reset-btn"
                    onClick={() => dispatch(resetFilters())}
                >
                    Сбросить фильтры
                </button>
            </div>
        </>
    );
}
