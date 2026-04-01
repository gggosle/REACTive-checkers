import React from 'react';

export interface UndoButtonProps {
    onUndo: () => void;
    canUndo: boolean;
}

export const UndoButton: React.FC<UndoButtonProps> = ({ onUndo, canUndo }) => {
    return (
        <button
            className="btn btn-primary"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last move"
        >
            Undo Move
        </button>
    );
};