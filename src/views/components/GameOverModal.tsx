import React from 'react';
import type { Player } from '../../models/Player';

interface GameOverModalProps {
    winner: Player | null;
    onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onRestart }) => {
    const isActive = winner !== null;

    return (
        <div className={`modal-overlay ${isActive ? 'active' : ''}`}>
            <div className="modal">
                <h2>Game Over!</h2>
                <div className="winner-text">
                    {winner ? `${winner.name} Wins!` : ''}
                </div>
                <button className="btn btn-primary" onClick={onRestart}>
                    Play Again
                </button>
            </div>
        </div>
    );
};