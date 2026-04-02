import type {Player} from '../types/game.ts'
import React from "react";


interface CapturedCountProps {
    players: Player[];
    capturedCount: Record<number, number>;
}

export const CapturedCount: React.FC<CapturedCountProps> = ({
                                                      players,
                                                      capturedCount,}) => {
    return (
        <div className="info-container">
            {players.map(player => (
                <div key={player.id} className="info-cell">
                    <span className={`turn-dot ${player.color}`} style={{ width: '12px', height: '12px', animation: 'none' }}></span>
                    <span>{player.name}:</span>
                    <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                        {capturedCount[player.id]}
                    </span>
                </div>
            ))}
        </div>
    );
};