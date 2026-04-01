import type {Player} from '../../types/game.ts'
import React from "react";
import {CapturedCount} from "./CapturedCount.tsx";
import {TurnIndicator} from "./TurnIndicator.tsx";


interface GameInfoProps {
    currentPlayer: Player;
    players: Player[];
    capturedCount: Record<number, number>;
}

export const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer,
                                                     players,
                                                      capturedCount,
                                                     }) => {
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
};