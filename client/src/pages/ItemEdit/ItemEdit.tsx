import React from 'react';
import { CircleX, RotateCw, ChevronDown, Lightbulb } from 'lucide-react';
import './ItemEdit.scss';

const ItemEdit: React.FC = () => {
    return (
        <div className="wrapper-edit">
            <div className="item-edit">
                <h1 className="item-edit__title">Редактирование объявления</h1>

                <form
                    className="item-edit__form"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="item-edit__field item-edit__field_half">
                        <label className="field-label">Категория</label>
                        <div className="input-wrapper">
                            <select className="input-control select-control">
                                <option>Электроника</option>
                            </select>
                            <ChevronDown className="input-icon" size={18} />
                        </div>
                    </div>

                    <div className="item-edit__divider" />

                    <div className="item-edit__field item-edit__field_half">
                        <label className="field-label field-label_required">
                            Название
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-control"
                                defaultValue='MacBook Pro 16"'
                            />
                            <button type="button" className="clear-btn">
                                <CircleX size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* Цена */}
                    {/* Цена */}
                    <div className="item-edit__field">
                        <label className="field-label field-label_required">
                            Цена
                        </label>

                        {/* Новый flex-контейнер */}
                        <div className="field-row">
                            {/* Ограничиваем ширину только для инпута */}
                            <div className="input-wrapper input-wrapper_half">
                                <input
                                    type="number"
                                    className="input-control"
                                    defaultValue="120000"
                                />
                                <button type="button" className="clear-btn">
                                    <CircleX size={16} strokeWidth={2} />
                                </button>
                            </div>
                      
                            <div className="ai-wrapper">
                                <div className="ai-popover">
                                    <span className="ai-popover__title">
                                        Ответ AI:
                                    </span>
                                    <div className="ai-popover__text">
                                        Средняя цена на MacBook Pro 16" M1 Pro
                                        (16/512GB):
                                        <ul>
                                            <li>
                                                115 000 – 135 000 ₽ — отличное
                                                состояние.
                                            </li>
                                            <li>
                                                От 140 000 ₽ — идеал, малый
                                                износ АКБ.
                                            </li>
                                            <li>
                                                90 000 – 110 000 ₽ — срочно или
                                                с дефектами.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="ai-popover__actions">
                                        <button
                                            type="button"
                                            className="btn btn_blue btn_small"
                                        >
                                            Применить
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn_outline btn_small"
                                        >
                                            Закрыть
                                        </button>
                                    </div>
                                </div>

                                <button type="button" className="ai-btn">
                                    <RotateCw size={16} strokeWidth={2} />
                                    <span>Повторить запрос</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="item-edit__divider" />
                   
                    <div className="item-edit__section">
                        <h2 className="section-title">Характеристики</h2>

                        <div className="item-edit__field item-edit__field_half">
                            <label className="field-label field-label_required">
                                Тип
                            </label>
                            <div className="input-wrapper">
                                <select className="input-control select-control">
                                    <option>Ноутбук</option>
                                </select>
                                <ChevronDown className="input-icon" size={18} />
                            </div>
                        </div>

                        <div className="item-edit__field item-edit__field_half">
                            <label className="field-label">Бренд</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="input-control"
                                    defaultValue="Apple"
                                />
                                <button type="button" className="clear-btn">
                                    <CircleX size={16} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        <div className="item-edit__field item-edit__field_half">
                            <label className="field-label">Модель</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="input-control"
                                    defaultValue="M1 Pro"
                                />
                                <button type="button" className="clear-btn">
                                    <CircleX size={16} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        <div className="item-edit__field item-edit__field_half">
                            <label className="field-label">Цвет</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="input-control"
                                    defaultValue="Серый"
                                />
                                <button type="button" className="clear-btn">
                                    <CircleX size={16} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        <div className="item-edit__field item-edit__field_half">
                            <label className="field-label">Состояние</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="input-control"
                                    defaultValue="Б/У"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="item-edit__divider" />
                    
                    <div className="item-edit__section">
                        <h2 className="section-title">Описание</h2>
                        <div className="item-edit__field item-edit__field_full">
                            <div className="textarea-wrapper">
                                <textarea className="input-control textarea-control"></textarea>
                                <div className="textarea-counter">0 / 1000</div>
                            </div>
                            <button type="button" className="ai-btn">
                                <Lightbulb size={16} strokeWidth={2} />
                                <span>Придумать описание</span>
                            </button>
                        </div>
                    </div>

                    
                    <div className="form-actions">
                        <button type="submit" className="btn btn_blue">
                            Сохранить
                        </button>
                        <button type="button" className="btn btn_gray">
                            Отменить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemEdit;
