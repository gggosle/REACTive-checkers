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
            <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                {players.map(player => (
                    <div key={player.id} style={{
                        padding: '8px 16px',
                        background: 'var(--white)',
                        borderRadius: 'var(--border-radius-xl)',
                        boxShadow: '0 4px 10px var(--shadow-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        color: 'var(--text-color)'
                    }}>
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