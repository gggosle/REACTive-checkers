import React from 'react';
import { useCheckers } from '../../hooks/useCheckers.ts';
import { Board } from './Board';
import {GameInfo} from "./GameInfo.tsx";
import {GameOverModal} from "./GameOverModal.tsx";
import {History} from "./History.tsx";

export const GameContainer: React.FC = () => {
    const {
        board,
        currentPlayer,
        players,
        capturedCount,
        selectedPiece,
        validMoves,
        history,
        winner,
        handlePieceClick,
        handleCellClick,
        handleTimeout,
        handleRestart
    } = useCheckers();

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
                onTimeOut={handleTimeout}
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