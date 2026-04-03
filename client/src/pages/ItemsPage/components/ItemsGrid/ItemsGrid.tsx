import { Loader } from '@mantine/core';
import ItemsPageCard from '../ItemsCardPage/ItemsPageCard';
import imgPath from '../../../../assets/images/main/placeholder.png'; 
import './ItemsGrid.scss';

interface ItemsGridProps {
    items: any[]; 
    isLoading: boolean;
    error: string | null;
}

const itemCategories: Record<string, string> = {
    auto: 'Авто',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
};

export default function ItemsGrid({ items, isLoading, error }: ItemsGridProps) {
    if (isLoading) {
        return (
            <div className="ads__grid">
                <div className="ads__loader-wrapper">
                    <Loader color="blue" size="xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ads__grid">
                <div className="ads__error">{error}</div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="ads__grid">
                <p>Объявлений не найдено</p>
            </div>
        );
    }

    return (
        <div className="ads__grid">
            {items.map((ad) => (
                <ItemsPageCard
                    key={ad.id}
                    {...ad}
                    category={itemCategories[ad.category]}
                    imgPath={imgPath}
                    badge={ad.needsRevision}
                />
            ))}
        </div>
    );
}