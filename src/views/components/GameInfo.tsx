import React from 'react';
import type { Player } from "../../models/Player";

interface GameInfoProps {
    currentPlayer: Player;
    players: Player[];
    capturedCount: Record<number, number>;
}

export const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer, players, capturedCount }) => {
    return (
        <header className="header">
            <h1 className="title">CHECKERS</h1>

            <div className="turn-indicator">
                <div className="timer-container">
                    <span className={`turn-dot ${currentPlayer.color}`}></span>
                    <span id="turn-text">{currentPlayer.name}'s Turn</span>
                </div>
            </div>
            <div className="captured-pieces-container">
                {players.map(player => (
                    <div key={player.id} className="captured-pieces-cell">
                        <span className={`turn-dot ${player.color}`} style={{ width: '12px', height: '12px', animation: 'none' }}></span>
                        <span>{player.name}:</span>
                        <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                            {capturedCount[player.id]}
                        </span>
                    </div>
                ))}
            </div>
        </header>
    );
};