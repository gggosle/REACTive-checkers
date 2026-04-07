import React from 'react';

export interface PlayerTimerProps {
    seconds: number;
    isActive: boolean;
}


const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerTimer: React.FC<PlayerTimerProps> = React.memo(({
                                                                       seconds,
                                                                       isActive
                                                                   }) => {
    return (
        <span
            style={{
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                color: isActive ? 'var(--primary-color)' : '#888',
                fontWeight: isActive ? 'bold' : 'normal',
                marginLeft: '8px',
                opacity: isActive ? 1 : 0.6
            }}
        >
            {formatTime(seconds)}
        </span>
    );
});