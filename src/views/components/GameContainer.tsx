import React from 'react';
import { useGame } from '../../hooks/useGame';
import { Board } from './Board';
import {GameInfo} from "./GameInfo.tsx";
import {GameOverModal} from "./GameOverModal.tsx";
import {History} from "./History.tsx";

export const GameContainer: React.FC = () => {
    const {
        boardState,
        currentPlayer,
        players,
        capturedCount,
        selectedPiece,
        validMoves,
        history,
        winner,
        handlePieceClick,
        handleCellClick,
        handleRestart
    } = useGame();

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
            />

            <div className="main-content">
                <main>
                    <Board
                        boardState={boardState}
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