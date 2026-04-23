import React from 'react';
import type {Player, TimerState} from '../types/game.ts';
import { PlayerTimer } from './PlayerTimer.tsx';
import { useGameClock } from '../hooks/useGameClock.ts';

export interface TimerControllerProps {
    activePlayerId: number | undefined;
    players: Player[];
    gameId: string,
    onTimeOut: () => void;
    initTimer: TimerState | undefined;
}

export const TimerController: React.FC<TimerControllerProps> = ({activePlayerId,
                                                                    players,
                                                                    gameId,
                                                                    onTimeOut,
                                                                    initTimer,
                                                                }) => {
    const { playerTimes } = useGameClock(activePlayerId, gameId, onTimeOut, initTimer);

    return (
        <div className="info-container">
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