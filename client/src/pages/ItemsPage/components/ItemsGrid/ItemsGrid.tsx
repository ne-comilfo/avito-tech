import { Loader } from '@mantine/core';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import ItemsPageCard from '../ItemsCardPage/ItemsPageCard';
import imgPath from '../../../../assets/images/main/placeholder.png';
import './ItemsGrid.scss';

const itemCategories: Record<string, string> = {
    auto: 'Авто',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
};

export default function ItemsGrid() {
    const { items, isLoading, error, viewMode } = useSelector(
        (state: RootState) => state.ads,
    );

    if (isLoading) {
        return (
            <div className={`ads__grid ads__grid--${viewMode}`}>
                <div className="ads__loader-wrapper">
                    <Loader color="blue" size="xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`ads__grid ads__grid--${viewMode}`}>
                <div className="ads__loader-wrapper">
                    <div className="ads__error">{error}</div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
             <div className={`ads__grid ads__grid--${viewMode}`}>
                <div className="ads__loader-wrapper">
                    <p>Объявлений не найдено</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`ads__grid ads__grid--${viewMode}`}>
            {items.map((ad) => (
                <ItemsPageCard
                    key={ad.id}
                    {...ad}
                    category={itemCategories[ad.category]}
                    imgPath={imgPath}
                    badge={ad.needsRevision}
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
}
