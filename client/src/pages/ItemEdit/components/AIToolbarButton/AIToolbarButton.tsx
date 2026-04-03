import React from 'react';
import { RotateCw, Lightbulb } from 'lucide-react';
import type { AIState } from '../../types';
import './AIToolbarButton.scss';

interface AIToolbarButtonProps {
    aiState: AIState;
    onClick: () => void;
    idleText: string;
}

const AIToolbarButton: React.FC<AIToolbarButtonProps> = ({
    aiState,
    onClick,
    idleText,
}) => {
    return (
        <button
            type="button"
            className="ai-btn"
            onClick={onClick}
            disabled={aiState.status === 'loading'}
        >
            {aiState.status === 'loading' ? (
                <RotateCw size={16} className="spinner" />
            ) : aiState.status === 'success' || aiState.status === 'error' ? (
                <RotateCw size={16} />
            ) : (
                <Lightbulb size={16} />
            )}
            <span>
                {aiState.status === 'loading'
                    ? 'Выполняется запрос'
                    : aiState.status === 'success' || aiState.status === 'error'
                      ? 'Повторить запрос'
                      : idleText}
            </span>
        </button>
    );
};

export default AIToolbarButton;
