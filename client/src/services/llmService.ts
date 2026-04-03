import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

export const askAI = async (prompt: string) => {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: 'gemma2:2b',
            prompt: prompt,
            stream: false,
            options: {
                num_predict: 200,
                temperature: 0.4,
            },
        });
        return response.data.response;
    } catch (error) {
        console.error('Ollama Error:', error);
        throw new Error('Не удалось связаться с локальной нейросетью');
    }
};

export const getPricePrompt = (item: any) => {
    const isRealty = item.category === 'real_estate';

    const realtyDetails = isRealty
        ? `Адрес: ${item.params?.address || 'не указан'}, Площадь: ${item.params?.area || ''} м², Этаж: ${item.params?.floor || ''}`
        : '';

    return `
            Инструкция: Ты — эксперт по оценке имущества. Пиши СТРОГО на русском языке.
            Товар: ${item.title}
            Категория: ${item.category}
            ${isRealty ? realtyDetails : `Характеристики: ${JSON.stringify(item.params)}`}

            Задание: Оцени рыночную стоимость. 
            ВАЖНО: Первой строкой напиши только одно среднее число БЕЗ пробелов и знаков (например, 7500000).

            Выдай ответ строго по шаблону (HTML <ul>):
            Средняя цена: [число] ₽
            <ul>
            <li>Рыночный максимум: [число] ₽</li>
            <li>Срочная продажа: [число] ₽</li>
            </ul>

            Никаких вступлений. Сразу число.
        `;
};

export const getDescriptionPrompt = (title: string, currentDesc: string) => `
            Инструкция: Ты — опытный продавец. Пиши СТРОГО на русском языке.
            Товар: ${title}
            ${currentDesc ? `Текущее описание: ${currentDesc}` : ''}

            Задание: Напиши текст для объявления. 
            КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
            - Использовать фразы в скобках типа [указать название] или [цель].
            - Писать вступления "Вот ваш текст".
            - Использовать Markdown (*, #, **).

            Требования:
            1. Сразу начинай с описания конкретного товара: ${title}.
            2. Пиши только то, что знаешь из названия. Если подробностей нет, просто опиши пользу этого типа товара.
            3. Используй только обычный текст и абзацы.
        `;
