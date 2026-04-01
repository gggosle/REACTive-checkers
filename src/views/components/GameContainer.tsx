import React, {useState} from 'react';
import { useCheckers } from '../../hooks/useCheckers.ts';
import { Board } from './Board';
import {GameInfo} from "./GameInfo.tsx";
import {GameOverModal} from "./GameOverModal.tsx";
import {History} from "./History.tsx";
import {loadGameSession} from "../../logic/storageUtils.ts";

export const GameContainer: React.FC = () => {
    const [savedSession] = useState(() => loadGameSession());

    const {
        board,
        currentPlayer,
        players,
        capturedCount,
        selectedPiece,
        validMoves,
        history,
        winner,
        gameId,
        handlePieceClick,
        handleCellClick,
        handleTimeout,
        handleRestart,
    } = useCheckers(savedSession?.game);

    return (
        <div className="game-container">
            <GameOverModal
                winner={winner}
                onRestart={handleRestart}
            />

            <GameInfo
                currentPlayer={currentPlayer}
                players={players}
                capturedCount={capturedCount}
                winner={winner}
                gameId={gameId}
                onTimeOut={handleTimeout}
                initTimer={savedSession?.timer}
            />

            <div className="main-content">
                <main>
                    <Board
                        boardState={board}
                        selectedPiece={selectedPiece}
                        validMoves={validMoves}
                        onPieceClick={handlePieceClick}
                        onCellClick={handleCellClick}
                    />
                </main>

                <History
                    history = {history}
                />

            </div>
        </div>
    );
};