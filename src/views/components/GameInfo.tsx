import React from 'react';
import type {Player} from "../../models/Player.ts";

interface GameInfoProps {
    currentPlayer: Player;
}

export const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer }) => {
    return (
        <header className="header">
            <h1 className="title">CHECKERS</h1>
            <div className="turn-indicator">
                <div className="timer-container">
                    <span className={`turn-dot ${currentPlayer.color}`}></span>
                    <span id="turn-text">{currentPlayer.name}'s Turn</span>
                </div>
            </div>
        </header>
    );
};