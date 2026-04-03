import React from 'react';
import { CircleX } from 'lucide-react';
import { categoryFields } from '../../constants';

interface CategoryParamsProps {
    category: string;
    params: Record<string, any>;
    onParamChange: (key: string, value: string) => void;
    onClearParam: (key: string) => void;
}

const CategoryParams: React.FC<CategoryParamsProps> = ({ category, params, onParamChange, onClearParam }) => {
    const currentCategoryProps = categoryFields[category] || {};

    if (Object.keys(currentCategoryProps).length === 0) return null;

    return (
        <div className="item-edit__section">
            <h2 className="section-title">Характеристики</h2>

            {Object.entries(currentCategoryProps).map(([key, label]) => (
                <div className="item-edit__field item-edit__field_half" key={key}>
                    <label className="field-label">{label}</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className={`input-control ${!params[key] ? 'input-control--not-required' : ''}`}
                            value={params[key] || ''}
                            onChange={(e) => onParamChange(key, e.target.value)}
                        />
                        {params[key] && (
                            <button type="button" className="clear-btn" onClick={() => onClearParam(key)}>
                                <CircleX size={16} strokeWidth={2} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryParams;