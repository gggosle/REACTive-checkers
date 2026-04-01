import React from 'react';
import type { Player } from '../../types/game.ts';
import { PlayerTimer } from './PlayerTimer';
import { useGameClock } from '../../hooks/useGameClock';

export interface TimerControllerProps {
    activePlayerId: number | undefined;
    players: Player[];
    onTimeOut: (loserId: number) => void;
}

export const TimerController: React.FC<TimerControllerProps> = ({activePlayerId,
                                                                    players,
                                                                    onTimeOut
                                                                }) => {
    const { playerTimes } = useGameClock(activePlayerId, onTimeOut);

    return (
        <div className="timer-container info-container">
            {players.map(player => (
                <div key={player.id} className={'info-cell'} style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={`turn-dot ${player.color}`} style={{ width: '12px', height: '12px', animation: 'none', marginRight: '6px' }}></span>
                    <span>{player.name}:</span>
                    <PlayerTimer
                        seconds={playerTimes[player.id]}
                        isActive={activePlayerId === player.id}
                    />
                </div>
            ))}
        </div>
    );
};