import './ItemCard.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import axios from 'axios';
import { SquarePen, AlertCircle, ArrowLeft } from 'lucide-react';
import placeHolderImg from '../../assets/images/card/placeholder.png';

const categoryFields: Record<string, Record<string, string>> = {
    auto: {
        brand: 'Бренд',
        model: 'Модель',
        yearOfManufacture: 'Год выпуска',
        transmission: 'Коробка передач',
        mileage: 'Пробег (км)',
        enginePower: 'Мощность (л.с.)',
    },
    real_estate: {
        type: 'Тип недвижимости',
        address: 'Адрес',
        area: 'Площадь (м²)',
        floor: 'Этаж',
    },
    electronics: {
        type: 'Тип устройства',
        brand: 'Бренд',
        model: 'Модель',
        color: 'Цвет',
        condition: 'Состояние',
    },
};

interface ItemData {
    id: number;
    title: string;
    description?: string;
    price: number | null;
    category: string;
    createdAt: string;
    updatedAt: string;
    needsRevision: boolean;
    params?: Record<string, any>;
    img: string[];
}

function ItemCard() {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<ItemData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/ads/${id}/edit`, { replace: true });
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/items/${id}`,
                );

                setItem(response.data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchItem();
    }, [id]);

    if (isLoading)
        return (
            <div className="wrapper-card wrapper-card--center">Загрузка...</div>
        );
    if (!item)
        return (
            <div className="wrapper-card wrapper-card--center">
                Объявление не найдено
            </div>
        );

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const missingLabels: string[] = [];
    const targetProps = categoryFields[item.category];
    if (!item.description) missingLabels.push('Описание');
    if (targetProps) {
        Object.entries(targetProps).forEach(([key, label]) => {
            const value = item.params?.[key];

            if (value === undefined || value === null || value === '') {
                missingLabels.push(label);
            }
        });
    }

    return (
        <div className="wrapper-card">
            <article className="item-view">
                <header className="item-view__header">
                    <h1 className="item-view__title">{item.title}</h1>
                    <div className="item-view__price">
                        {item.price
                            ? `${item.price.toLocaleString()} ₽`
                            : 'Цена не указана'}
                    </div>
                </header>

                <div className="item-view__controls">
                    <div className="item-view__controls-btns">
                        <button
                            className="button button_theme_blue"
                            onClick={() => handleEdit()}
                        >
                            Редактировать
                            <SquarePen size={18} className="button__icon" />
                        </button>
                        <button
                            type="button"
                            className="btn btn_outline btn_small mb-4"
                            onClick={() => navigate(-1)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100px',
                                padding: '5px',
                            }}
                        >
                            <ArrowLeft size={16} />
                            Назад
                        </button>
                    </div>

                    <div className="item-view__meta">
                        <span className="item-view__date">
                            Опубликовано: {formatDate(item.createdAt)}
                        </span>
                        {item.updatedAt && (
                            <span className="item-view__date">
                                Отредактировано: {formatDate(item.updatedAt)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="item-view__divider"></div>

                <div className="item-view__body">
                    <div className="item-view__main-col">
                        <div className="item-view__gallery">
                            <div className="item-view__images">
                                <div className="image-placeholder">
                                    <img
                                        src={
                                            item.img && item.img.length > 0
                                                ? item.img[0]
                                                : placeHolderImg
                                        }
                                        alt={item.title}
                                    />
                                </div>

                                {item.img && item.img.length > 1 && (
                                    <div className="image-items">
                                        {item.img.slice(1).map((src, index) => (
                                            <div
                                                className="image-items__thumbnail"
                                                key={index}
                                            >
                                                <img
                                                    src={src}
                                                    alt={`${item.title} - ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <section className="item-view__description description">
                            <h2 className="description__title">Описание</h2>
                            <p className="description__text">
                                {item.description || 'Описание отсутствует'}
                            </p>
                        </section>
                    </div>

                    <div className="item-view__info">
                        {item.needsRevision && (
                            <div className="warning-block">
                                <div className="warning-block__header">
                                    <AlertCircle size={18} color="#F5A623" />
                                    <span className="warning-block__title">
                                        Требуются доработки
                                    </span>
                                </div>
                                <p className="warning-block__text">
                                    У объявления не заполнены поля:
                                </p>
                                <ul className="warning-block__list">
                                    {missingLabels.map((label, idx) => (
                                        <li
                                            key={idx}
                                            className="warning-block__list-item"
                                        >
                                            {label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <section className="characteristics">
                            <h2 className="characteristics__title">
                                Характеристики
                            </h2>
                            <dl className="characteristics__list">
                                <div className="characteristics__row">
                                    <dt className="characteristics__term">
                                        Категория
                                    </dt>
                                    <dd className="characteristics__value">
                                        {item.category === 'auto'
                                            ? 'Автомобиль'
                                            : item.category === 'real_estate'
                                              ? 'Недвижимость'
                                              : 'Электроника'}
                                    </dd>
                                </div>

                                {item.params &&
                                    Object.entries(item.params).map(
                                        ([key, value]) => {
                                            if (
                                                value === undefined ||
                                                value === null ||
                                                value === ''
                                            )
                                                return null;
                                            const label =
                                                categoryFields[item.category]?.[
                                                    key
                                                ] || key;

                                            return (
                                                <div
                                                    className="characteristics__row"
                                                    key={key}
                                                >
                                                    <dt className="characteristics__term">
                                                        {label}
                                                    </dt>
                                                    <dd className="characteristics__value">
                                                        {String(value)}
                                                    </dd>
                                                </div>
                                            );
                                        },
                                    )}
                            </dl>
                        </section>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default ItemCard;
