import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircleX } from 'lucide-react';
import './ItemEdit.scss';

import Toast from './components/Toast/Toast';
import AIPopover from './components/AIPopover/AIPopover';
import AIToolbarButton from './components/AIToolbarButton/AIToolbarButton';
import CategoryParams from './components/CategoryParams/CategoryParams';

import {
    askAI,
    getPricePrompt,
    getDescriptionPrompt,
} from '../../services/llmService';
import { categoryLabels } from './constants';
import type { ItemData, ToastState, FormValues, AIState } from './types';

const ItemEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [priceAI, setPriceAI] = useState<AIState>({
        status: 'idle',
        result: null,
    });
    const [descAI, setDescAI] = useState<AIState>({
        status: 'idle',
        result: null,
    });

    const [formData, setFormData] = useState<FormValues>({
        title: '',
        price: '',
        category: '',
        description: '',
        params: {},
    });

    const [serverSnapshot, setServerSnapshot] = useState<FormValues | null>(
        null,
    );

    const isFormValid: boolean = Boolean(
        formData.title.trim() && formData.price.toString().trim(),
    );

    const extractPrice = (text: string): string => {
        if (!text) return '';
        const priceContext = text.includes('Средняя цена')
            ? text.substring(text.indexOf('Средняя цена'))
            : text;
        const cleanText = priceContext.replace(/[\s,.]/g, '');
        const matches = cleanText.match(/\d+/);
        return matches ? matches[0] : '';
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/items/${id}`,
                );
                const serverData: ItemData = response.data;
                const savedDraft = localStorage.getItem(`draft_edit_${id}`);

                const baseData: FormValues = {
                    title: serverData.title || '',
                    price: serverData.price ? String(serverData.price) : '',
                    category: serverData.category || 'electronics',
                    description: serverData.description || '',
                    params: serverData.params
                        ? Object.fromEntries(
                              Object.entries(serverData.params).map(
                                  ([k, v]) => [k, v ? String(v) : ''],
                              ),
                          )
                        : {},
                };

                setServerSnapshot(baseData);

                if (savedDraft) {
                    const isRestore = window.confirm(
                        'У вас есть несохранённые изменения для этого объявления. Восстановить их?',
                    );

                    if (isRestore) {
                        setFormData(JSON.parse(savedDraft));
                        setIsLoading(false);
                        return;
                    } else {
                        localStorage.removeItem(`draft_edit_${id}`);
                    }
                }
                setFormData(baseData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    useEffect(() => {
        if (isLoading || !serverSnapshot) return;

        const isChanged =
            JSON.stringify(formData) !== JSON.stringify(serverSnapshot);

        if (isChanged) {
            const timer = setTimeout(() => {
                localStorage.setItem(
                    `draft_edit_${id}`,
                    JSON.stringify(formData),
                );
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            localStorage.removeItem(`draft_edit_${id}`);
        }
    }, [formData, id, isLoading, serverSnapshot]);

    const handleAIRequest = async (type: 'price' | 'description') => {
        const setState = type === 'price' ? setPriceAI : setDescAI;
        setState({ status: 'loading', result: null });

        try {
            const prompt =
                type === 'price'
                    ? getPricePrompt(formData)
                    : getDescriptionPrompt(
                          formData.title,
                          formData.description,
                      );
            const result = await askAI(prompt);
            setState({ status: 'success', result: result });
        } catch {
            setState({ status: 'error', result: null });
        }
    };

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
        if (!isFormValid) {
            const firstError = document.querySelector('.input-control--error');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

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
            localStorage.removeItem(`draft_edit_${id}`);

            setToast({ type: 'success', text: 'Изменения сохранены' });
            setTimeout(() => {
                navigate(`/ads/${id}`, { replace: true });
            }, 1500);
        } catch {
            setToast({
                type: 'error',
                text: 'При попытке сохранить изменения произошла ошибка.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading)
        return (
            <div className="wrapper-edit wrapper-edit--center">Загрузка...</div>
        );

    return (
        <div className="wrapper-edit">
            {toast && (
                <Toast
                    type={toast.type as 'success' | 'error'}
                    title={
                        toast.type === 'error'
                            ? 'Ошибка сохранения'
                            : 'Изменения сохранены'
                    }
                    text={toast.type === 'error' ? toast.text : ''}
                    onClose={() => setToast(null)}
                />
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
                            {!formData.title && (
                                <div className="input__error">
                                    Название должно быть заполнено
                                </div>
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
                                    min="0"
                                    className={`input-control ${!formData.price ? 'input-control--error' : ''}`}
                                    onKeyDown={(e) => {
                                        if (['-', 'e', '+'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    value={formData.price}
                                    onChange={(e) => {
                                        handleMainChange(
                                            'price',
                                            e.target.value,
                                        );
                                    }}
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
                                {!formData.price && (
                                    <div className="input__error">
                                        Цена должна быть заполнена
                                    </div>
                                )}
                            </div>

                            <div className="ai-wrapper">
                                <AIToolbarButton
                                    aiState={priceAI}
                                    onClick={() => handleAIRequest('price')}
                                    idleText="Узнать рыночную цену"
                                />
                                {(priceAI.status === 'success' ||
                                    priceAI.status === 'error') && (
                                    <AIPopover
                                        title="Ответ AI:"
                                        text={priceAI.result || ''}
                                        isError={priceAI.status === 'error'}
                                        onClose={() =>
                                            setPriceAI({
                                                status: 'idle',
                                                result: null,
                                            })
                                        }
                                        onApply={() => {
                                            if (priceAI.result) {
                                                const parsedPrice =
                                                    extractPrice(
                                                        priceAI.result,
                                                    );
                                                if (parsedPrice)
                                                    handleMainChange(
                                                        'price',
                                                        parsedPrice,
                                                    );
                                            }
                                            setPriceAI({
                                                status: 'idle',
                                                result: null,
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="item-edit__divider" />

                    <CategoryParams
                        category={formData.category}
                        params={formData.params}
                        onParamChange={handleParamChange}
                        onClearParam={clearParamField}
                    />

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

                            <div className="ai-wrapper mt-2">
                                <AIToolbarButton
                                    aiState={descAI}
                                    onClick={() =>
                                        handleAIRequest('description')
                                    }
                                    idleText={
                                        !formData.description
                                            ? 'Придумать описание'
                                            : 'Улучшить описание'
                                    }
                                />
                                {(descAI.status === 'success' ||
                                    descAI.status === 'error') && (
                                    <AIPopover
                                        title="Предложение AI:"
                                        text={descAI.result || ''}
                                        isError={descAI.status === 'error'}
                                        onClose={() =>
                                            setDescAI({
                                                status: 'idle',
                                                result: null,
                                            })
                                        }
                                        onApply={() => {
                                            handleMainChange(
                                                'description',
                                                descAI.result || '',
                                            );
                                            setDescAI({
                                                status: 'idle',
                                                result: null,
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions mt-6">
                        <button
                            type="submit"
                            className={`btn btn_blue ${!isFormValid ? 'btn__disabled' : ''}`}
                            disabled={!isFormValid || isSaving}
                        >
                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                            type="button"
                            className="btn btn_gray"
                            onClick={() => {
                                const isDirty =
                                    JSON.stringify(formData) !==
                                    JSON.stringify(serverSnapshot);
                                if (
                                    isDirty &&
                                    !window.confirm(
                                        'У вас есть несохраненные изменения. Выйти?',
                                    )
                                )
                                    return;
                                navigate(`/ads/${id}`, { replace: true });
                            }}
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
