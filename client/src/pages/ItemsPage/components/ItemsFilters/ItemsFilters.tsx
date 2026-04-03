import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Switch } from '@mantine/core';
import './ItemsFilters.scss';

interface ItemsFiltersProps {
    selectedCategories: string[];
    onCategoryChange: (category: string) => void;
    needsRevision: boolean;
    onRevisionChange: (value: boolean) => void;
    onReset: () => void;
}

export default function ItemsFilters({
    selectedCategories,
    onCategoryChange,
    needsRevision,
    onRevisionChange,
    onReset,
}: ItemsFiltersProps) {
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
                                    onChange={() => onCategoryChange('auto')}
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
                                        onCategoryChange('electronics')
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
                                        onCategoryChange('real_estate')
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
                                onRevisionChange(event.currentTarget.checked)
                            }
                            label="Только требующие доработок"
                            labelPosition="left"
                        />
                    </label>
                </div>
            </div>
            <div className="filters__reset">
                <button className="filters__reset-btn" onClick={onReset}>
                    Сбросить фильтры
                </button>
            </div>
        </>
    );
}
