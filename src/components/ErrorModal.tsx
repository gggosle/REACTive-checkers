import React from 'react';

interface ErrorModalProps {
    title: string;
    message: string;
    onReload?: () => void;
    onDismiss?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ title, message, onReload, onDismiss }) => {
    return (
        <div className="modal-overlay active">
            <div className="modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    {onReload && (
                        <button className="btn btn-secondary" onClick={onReload}>
                            Reload Game
                        </button>
                    )}
                    {onDismiss && (
                        <button className="btn btn-primary" onClick={onDismiss}>
                            Dismiss
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};