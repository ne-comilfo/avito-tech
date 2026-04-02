import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircleX, RotateCw, Lightbulb, Check, X } from 'lucide-react';
import './ItemEdit.scss';

import { categoryFields, categoryLabels } from './constants';
import type { ItemData, ToastState, FormValues } from './types';

const ItemEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    const [formData, setFormData] = useState<FormValues>({
        title: '',
        price: '',
        category: '',
        description: '',
        params: {},
    });

    const isFormValid: boolean = Boolean(
        formData.title.trim() && formData.price.toString().trim(),
    );

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/items/${id}`,
                );
                const data: ItemData = response.data;

                setFormData({
                    title: data.title || '',
                    price: data.price ? String(data.price) : '',
                    category: data.category || 'electronics',
                    description: data.description || '',
                    params: data.params
                        ? Object.fromEntries(
                              Object.entries(data.params).map(([k, v]) => [
                                  k,
                                  v ? String(v) : '',
                              ]),
                          )
                        : {},
                });
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchItem();
    }, [id]);

    const handleMainChange = (field: keyof FormValues, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleParamChange = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            params: { ...prev.params, [key]: value },
        }));
    };

    const clearMainField = (field: keyof FormValues) => {
        setFormData((prev) => ({ ...prev, [field]: '' }));
    };

    const clearParamField = (key: string) => {
        setFormData((prev) => ({
            ...prev,
            params: { ...prev.params, [key]: '' },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSaving(true);
        setToast(null);

        try {
            const payload = {
                title: formData.title.trim(),
                price: Number(formData.price),
                description: formData.description.trim(),
                category: formData.category,
                params: formData.params,
            };

            await axios.patch(`http://localhost:8080/items/${id}`, payload);

            setToast({ type: 'success', text: '' });

            setTimeout(() => {
                navigate(`/ads/${id}`, { replace: true });
            }, 1500);
        } catch (error: any) {
            console.error('Ошибка при сохранении:', error);

            setToast({
                type: 'error',
                text: 'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading)
        return (
            <div className="wrapper-edit wrapper-edit--center">Загрузка...</div>
        );

    const currentCategoryProps = categoryFields[formData.category] || {};

    return (
        <div className="wrapper-edit">
            {toast && (
                <div className={`toast-message toast-message--${toast.type}`}>
                    <div className="toast-message__content">
                        <div className="toast-message__icon">
                            {toast.type === 'success' ? (
                                
                                <div className="icon-success-bg">
                                    <Check
                                        size={14}
                                        strokeWidth={4}
                                        color="white"
                                    />
                                </div>
                            ) : (
                                
                                <CircleX size={24} strokeWidth={2} />
                            )}
                        </div>

                        <div className="toast-message__text-container">
                            <span className="toast-message__title">
                                {toast.type === 'success'
                                    ? 'Изменения сохранены'
                                    : 'Ошибка сохранения'}
                            </span>
                            <p className="toast-message__text">{toast.text}</p>
                        </div>
                    </div>

                    <button
                        className="toast-message__close"
                        onClick={() => setToast(null)}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            <div className="item-edit">
                <h1 className="item-edit__title">Редактирование объявления</h1>

                <form className="item-edit__form" onSubmit={handleSubmit}>
                    <div className="item-edit__field item-edit__field_half">
                        <label className="field-label">Категория</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-control"
                                value={
                                    categoryLabels[formData.category] ||
                                    formData.category
                                }
                                disabled
                            />
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
                                className={`input-control ${!formData.title ? 'input-control--error' : ''}`}
                                value={formData.title}
                                onChange={(e) =>
                                    handleMainChange('title', e.target.value)
                                }
                            />
                            {formData.title && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={() => clearMainField('title')}
                                >
                                    <CircleX size={16} strokeWidth={2} />
                                </button>
                            )}
                            {!formData.title ? (
                                <div className="input__error">
                                    Название должно быть заполнено
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>

                    <div className="item-edit__field">
                        <label className="field-label field-label_required">
                            Цена
                        </label>
                        <div className="field-row">
                            <div className="input-wrapper input-wrapper_half">
                                <input
                                    type="number"
                                    className={`input-control ${!formData.price ? 'input-control--error' : ''}`}
                                    value={formData.price}
                                    onChange={(e) =>
                                        handleMainChange(
                                            'price',
                                            e.target.value,
                                        )
                                    }
                                />
                                {formData.price && (
                                    <button
                                        type="button"
                                        className="clear-btn"
                                        onClick={() => clearMainField('price')}
                                    >
                                        <CircleX size={16} strokeWidth={2} />
                                    </button>
                                )}
                                {!formData.price ? (
                                    <div className="input__error">
                                        Цена должна быть заполнена
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="ai-wrapper">
                                <button type="button" className="ai-btn">
                                    <RotateCw size={16} strokeWidth={2} />
                                    <span>Узнать рыночную цену</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="item-edit__divider" />

                    <div className="item-edit__section">
                        <h2 className="section-title">Характеристики</h2>

                        {Object.entries(currentCategoryProps).map(
                            ([key, label]) => (
                                <div
                                    className="item-edit__field item-edit__field_half"
                                    key={key}
                                >
                                    <label className="field-label">
                                        {label}
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            className={`input-control ${!formData.params[key] ? 'input-control--not-required' : ''}`}
                                            value={formData.params[key] || ''}
                                            onChange={(e) =>
                                                handleParamChange(
                                                    key,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {formData.params[key] && (
                                            <button
                                                type="button"
                                                className="clear-btn"
                                                onClick={() =>
                                                    clearParamField(key)
                                                }
                                            >
                                                <CircleX
                                                    size={16}
                                                    strokeWidth={2}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="item-edit__divider" />

                    <div className="item-edit__section">
                        <h2 className="section-title">Описание</h2>
                        <div className="item-edit__field item-edit__field_full">
                            <div className="textarea-wrapper">
                                <textarea
                                    className="input-control textarea-control"
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleMainChange(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={1000}
                                />
                                <div className="textarea-counter">
                                    {formData.description.length} / 1000
                                </div>
                            </div>
                            <button type="button" className="ai-btn mt-2">
                                <Lightbulb size={16} strokeWidth={2} />
                                <span>Улучшить описание</span>
                            </button>
                        </div>
                    </div>

                    <div className="form-actions mt-6">
                        <button
                            type="submit"
                            className={`btn btn_blue ${!isFormValid ? 'btn__disabled' : ''}`}
                            disabled={!isFormValid}
                        >
                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                            type="button"
                            className="btn btn_gray"
                            onClick={() => navigate(-1)}
                        >
                            Отменить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemEdit;
