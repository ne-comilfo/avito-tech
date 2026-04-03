import React from 'react';
import './AIPopover.scss';

export interface AIPopoverProps {
    title: string;
    text: string;
    isError?: boolean;
    onClose: () => void;
    onApply: () => void;
}

const AIPopover: React.FC<AIPopoverProps> = ({
    title,
    text,
    isError,
    onClose,
    onApply,
}) => {
    return (
        <div className={`ai-popover ${isError ? 'ai-popover--error' : ''}`}>
            <span className="ai-popover__title">
                {isError ? 'Произошла ошибка' : title}
            </span>
            <div className="ai-popover__text">
                {isError ? (
                    <p>
                        При попытке запроса к AI произошла ошибка. Попробуйте
                        повторить запрос или закройте уведомление.
                    </p>
                ) : (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: text.replace(/\n/g, '<br/>'),
                        }}
                    />
                )}
            </div>
            <div className="ai-popover__actions">
                {!isError && (
                    <button
                        type="button"
                        className="btn btn_blue btn_small"
                        onClick={onApply}
                    >
                        Применить
                    </button>
                )}
                <button
                    type="button"
                    className="btn btn_outline btn_small"
                    onClick={onClose}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default AIPopover;
