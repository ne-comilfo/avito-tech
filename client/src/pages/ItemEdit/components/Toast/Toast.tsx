import React from 'react';
import { Check, CircleX, X } from 'lucide-react';
import './Toast.scss';

export interface ToastProps {
    type: 'success' | 'error';
    title: string;
    text: string;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, text, onClose }) => {
    return (
        <div className={`toast-message toast-message--${type}`}>
            <div className="toast-message__content">
                <div className="toast-message__icon">
                    {type === 'success' ? (
                        <div className="icon-success-bg">
                            <Check size={14} strokeWidth={4} color="white" />
                        </div>
                    ) : (
                        <CircleX size={24} strokeWidth={2} />
                    )}
                </div>

                <div className="toast-message__text-container">
                    <span className="toast-message__title">{title}</span>
                    <p className="toast-message__text">{text}</p>
                </div>
            </div>

            <button className="toast-message__close" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;