import React, {useState} from 'react';
import { useCheckers } from '../../hooks/useCheckers.ts';
import { Board } from './Board';
import {GameInfo} from "./GameInfo.tsx";
import {GameOverModal} from "./GameOverModal.tsx";
import {History} from "./History.tsx";
import {loadGameSession} from "../../hooks/useLocalStorage.ts";
import {UndoButton} from "./UndoButton.tsx";
import {TimerController} from "./TimerController.tsx";

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
        handleUndo,
        canUndo,
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
            />

            <TimerController
                key={gameId}
                activePlayerId={winner ? undefined : currentPlayer.id}
                players={players}
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
            <div className="footer">
                <button className="btn btn-primary" onClick={handleRestart}>
                    Restart Game
                </button>

                <UndoButton onUndo={handleUndo} canUndo={canUndo} />
            </div>
        </div>
    );
};