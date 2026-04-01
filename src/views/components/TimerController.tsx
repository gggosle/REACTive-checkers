import React, { useState, useEffect } from 'react';
import type { Player } from '../../types/game.ts';
import { PlayerTimer } from './PlayerTimer';

export interface TimerControllerProps {
    activePlayerId: number | undefined;
    players: Player[];
    onTimeOut: (loserId: number) => void;
}

export const TimerController: React.FC<TimerControllerProps> = ({
                                                                    activePlayerId,
                                                                    players,
                                                                    onTimeOut
                                                                }) => {
    const [playerTimes, setPlayerTimes] = useState<Record<number, number>>({
        1: 30,
        2: 30
    });

    useEffect(() => {
        if (!activePlayerId) return;

        const interval = setInterval(() => {
            setPlayerTimes(prevTimes => {
                const currentTime = prevTimes[activePlayerId];

                if (currentTime <= 1) {
                    clearInterval(interval);
                    onTimeOut(activePlayerId);
                    return { ...prevTimes, [activePlayerId]: 0 };
                }

                return {
                    ...prevTimes,
                    [activePlayerId]: currentTime - 1
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activePlayerId, onTimeOut]);

    return (
        <div className="timer-controller-wrapper" style={{ display: 'flex', gap: '20px' }}>
            {players.map(player => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={`turn-dot ${player.color}`} style={{ width: '12px', height: '12px', animation: 'none', marginRight: '6px' }}></span>
                    <span style={{ fontSize: '0.9rem', marginRight: '4px' }}>{player.name}:</span>
                    <PlayerTimer
                        seconds={playerTimes[player.id]}
                        isActive={activePlayerId === player.id}
                    />
                </div>
            ))}
        </div>
    );
};