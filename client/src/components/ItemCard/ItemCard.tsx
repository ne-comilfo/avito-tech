import './ItemCard.scss';

import { SquarePen } from 'lucide-react';

type Props = {
    title: string;
    price: number | string;
    image?: string;
    type: string;
    brand: string;
    model: string;
    color: string;
    state: string;
    descr: string;
    badge: boolean;
};

const WarningIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5A623">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
);

const fields: Record<string, string> = {
    brand: 'Бренд',
    model: 'Модель',
    color: 'Цвет',
    state: 'Состояние',
    descr: 'Описание',
};

import placeHolderImg from '../../assets/images/card/placeholder.png';
function ItemCard(props: Props) {
    const { image, descr, badge } = props;

    const notComplete = (Object.keys(fields) as Array<keyof Props>).filter(
        (key) => !props[key],
    );

    return (
        <div className="wrapper-card">
            <article className="item-view">
                <header className="item-view__header">
                    <h1 className="item-view__title">MacBook Pro 16"</h1>
                    {/* MacBook Pro 16" */}
                    <div className="item-view__price">{64000} ₽</div>{' '}
                    {/* 64000 */}
                </header>

                <div className="item-view__controls">
                    <button className="button button_theme_blue">
                        Редактировать
                        <SquarePen size={18} className="button__icon" />
                    </button>
                    <div className="item-view__meta">
                        <span className="item-view__date">
                            Опубликовано: 10 марта 22:39
                        </span>
                        <span className="item-view__date">
                            Отредактировано: 10 марта 23:12
                        </span>
                    </div>
                </div>

                <div className="item-view__divider"></div>

                <div className="item-view__body">
                    <div className="item-view__main-col">
                        <div className="item-view__gallery">
                            <div className="image-placeholder">
                                <img src={image || placeHolderImg} />
                            </div>
                        </div>

                        <section className="item-view__description description">
                            <h2 className="description__title">Описание</h2>
                            <p className="description__text">
                                Продаю свой MacBook Pro 16" (2021) на чипе M1
                                Pro. Состояние отличное, работал бережно.
                                Мощности хватает на всё: от сложного монтажа до
                                кода, при этом ноутбук почти не греется.
                            </p>
                        </section>
                    </div>

                    <div className="item-view__info">
                        {!badge ? (
                            <div className="warning-block">
                                <div className="warning-block__header">
                                    <WarningIcon />
                                    <span className="warning-block__title">
                                        Требуются доработки
                                    </span>
                                </div>
                                <p className="warning-block__text">
                                    У объявления не заполнены поля:
                                </p>
                                <ul className="warning-block__list">
                                    {notComplete.map((key) => (
                                        <li
                                            key={key}
                                            className="warning-block__list-item"
                                        >
                                            {fields[key]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            ''
                        )}
                        <section className="characteristics">
                            <h2 className="characteristics__title">
                                Характеристики
                            </h2>
                            <dl className="characteristics__list">
                                <div className="characteristics__row">
                                    <dt className="characteristics__term">
                                        Тип
                                    </dt>
                                    <dd className="characteristics__value">
                                        Ноутбук
                                    </dd>
                                </div>
                                <div className="characteristics__row">
                                    <dt className="characteristics__term">
                                        Бренд
                                    </dt>
                                    <dd className="characteristics__value">
                                        Apple
                                    </dd>
                                </div>
                                <div className="characteristics__row">
                                    <dt className="characteristics__term">
                                        Модель
                                    </dt>
                                    <dd className="characteristics__value">
                                        M1 Pro
                                    </dd>
                                </div>
                            </dl>
                        </section>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default ItemCard;
