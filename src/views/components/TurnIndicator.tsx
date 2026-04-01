import type {Player} from '../../types/game.ts'
import React from "react";


interface TurnIndicatorProps {
    currentPlayer: Player;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ currentPlayer,
                                                  }) => {
    return (
        <div className="turn-indicator">
            <span className={`turn-dot ${currentPlayer.color}`}></span>
            <span id="turn-text">{currentPlayer.name}'s Turn</span>
        </div>
    );
};