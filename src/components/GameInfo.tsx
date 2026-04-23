import type {Player} from '../types/game.ts'
import React, {memo, useMemo} from "react";
import {CapturedCount} from "./CapturedCount.tsx";
import {TurnIndicator} from "./TurnIndicator.tsx";


interface GameInfoProps {
    currentPlayerId: number;
    players: Player[];
    capturedCount: Record<number, number>;
}

export const GameInfo: React.FC<GameInfoProps> = memo(({ currentPlayerId,
                                                     players,
                                                      capturedCount,
                                                     }) => {
    const currentPlayer = useMemo(() => players.find(player => player.id === currentPlayerId), [currentPlayerId, players]);
    return (
        <header className="header">
            <h1 className="title">CHECKERS</h1>
            <TurnIndicator
                currentPlayer={currentPlayer}
            />
            <CapturedCount
                players={players}
                capturedCount={capturedCount}
            />
        </header>
    );
})