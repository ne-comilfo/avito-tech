import './ItemsPage.scss';
import { LayoutGrid, List } from 'lucide-react';
import { Switch } from '@mantine/core';
import { Search } from 'lucide-react';

import imgPath from '../../assets/images/main/placeholder.png';
import ItemsPageCard from './ItemsPageCard';

function ItemsPage() {
    const item = {
        imgPath: imgPath,
        category: 'Электроника',
        title: 'Телефон',
        price: 10000,
        badge: true,
    };

    return (
        <div className="ads">
            <div className="ads__header">
                <h1 className="ads__title">Мои объявления</h1>
                <span className="ads__count">42 объявления</span>
            </div>

            <div className="ads__controls">
                <div className="search">
                    <input
                        className="search__input"
                        placeholder="Найти объявление..."
                        type="search"
                    />

                    <button className="search__btn">
                        <Search size={14} />
                    </button>
                </div>

                <div className="ads__view">
                    <LayoutGrid size={20} color="#1890FF" />
                    <div className="ads__divider"></div>
                    <List size={20} />
                </div>

                <select className="ads__sort">
                    <option>По новизне (сначала новые)</option>
                </select>
            </div>

            <div className="ads__content">
                <aside className="ads__sidebar">
                    <div className="filters">
                        <h3 className="filters__title">Фильтры</h3>

                        <div className="filters__block">
                            <div className="filters__header">
                                <div className="filters__subtitle">
                                    Категория
                                </div>
                                <div className="filters__expand">^</div>
                            </div>

                            <label className="filters__item">
                                <input type="checkbox" /> Авто
                            </label>
                            <label className="filters__item">
                                <input type="checkbox" /> Электроника
                            </label>
                            <label className="filters__item">
                                <input type="checkbox" /> Недвижимость
                            </label>
                        </div>

                        <div className="filters__block">
                            <Switch
                                label="Только требующие доработок"
                                labelPosition="left"
                            />
                        </div>
                    </div>
                    <div className="filters__reset">
                        <button className="filters__reset-btn">Сбросить фильтры</button>
                    </div>
                    
                </aside>
                <div className="ads__right">
                    <div className="ads__grid">
                        <ItemsPageCard
                            {...item}
                            title={'Volkswagen Polo'}
                            badge={false}
                            category="Авто"
                        />
                        <ItemsPageCard {...item} />
                        <ItemsPageCard {...item} />
                        <ItemsPageCard {...item} />
                        <ItemsPageCard {...item} />
                        <ItemsPageCard {...item} />
                    </div>

                    <div className="ads__pagination">
                        <button className="ads__page-btn ads__page-btn--blocked">
                            {'<'}
                        </button>
                        <button className="ads__page-btn ads__page-btn--active">
                            1
                        </button>
                        <button className="ads__page-btn">2</button>
                        <button className="ads__page-btn">3</button>
                        <button className="ads__page-btn">4</button>
                        <button className="ads__page-btn">5</button>
                        <button className="ads__page-btn ads__page-btn--next">
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemsPage;
