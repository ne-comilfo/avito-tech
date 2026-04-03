export const categoryFields: Record<string, Record<string, string>> = {
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

export const categoryLabels: Record<string, string> = {
    auto: 'Автомобили',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
};
