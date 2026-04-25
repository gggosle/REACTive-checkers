import React, {useState} from 'react';
import { useCheckers } from '../hooks/useCheckers.ts';
import { Board } from './Board.tsx';
import {GameInfo} from "./GameInfo.tsx";
import {GameOverModal} from "./GameOverModal.tsx";
import {ErrorModal} from "./ErrorModal.tsx";
import {loadGameSession} from "../hooks/useLocalStorage.ts";
import {UndoButton} from "./UndoButton.tsx";
import {TimerController} from "./TimerController.tsx";
import {CssSpinner} from "./CssSpinner.tsx";

export const GameContainer: React.FC = () => {
    const [savedSession] = useState(() => loadGameSession());

    const {
        fetchError,
        errorModalData,
        board,
        currentPlayerId,
        players,
        capturedCount,
        selectedPiece,
        validMoves,
        winnerId,
        isTimeOut,
        gameId,
        isLoading,
        isAiThinking,
        handlePieceClick,
        handleCellClick,
        handleUndo,
        canUndo,
        handleTimeout,
        handleRestart,
        handleReloadGame,
        dismissError,
    } = useCheckers();

    return (
        <div className="game-container">
            {fetchError && (
                <div className="bg-red-500 text-white p-2 rounded flex justify-between">
                    <span>{fetchError}</span>
                    <button onClick={dismissError}>&times;</button>
                </div>
            )}
            <GameOverModal
                winner={winnerId}
                onRestart={handleRestart}
            />
            {errorModalData && (
                <ErrorModal
                    title={errorModalData.title}
                    message={errorModalData.message}
                    onReload={handleReloadGame}
                    onDismiss={handleRestart}
                />
            )}

            <GameInfo
                currentPlayerId={currentPlayerId}
                players={players}
                capturedCount={capturedCount}
            />

            <TimerController
                key={gameId}
                activePlayerId={isTimeOut ? undefined : currentPlayerId}
                players={players}
                gameId={gameId}
                onTimeOut={handleTimeout}
                initTimer={savedSession?.timer}
            />

            <div className="main-content">
                <main style={{ pointerEvents: (isLoading || isAiThinking) ? 'none' : 'auto' }}>
                    {isAiThinking && (
                        <div className="ai-thinking-overlay">
                            <CssSpinner />
                            <span>AI thinking...</span>
                        </div>
                    )}
                    <Board
                        boardState={board}
                        selectedPiece={selectedPiece}
                        validMoves={validMoves}
                        onPieceClick={handlePieceClick}
                        onCellClick={handleCellClick}
                    />
                </main>
            </div>
            <div className="footer">
                <button className="btn btn-primary" onClick={handleRestart} disabled={isLoading || isAiThinking}>
                    Restart Game
                </button>

                <UndoButton onUndo={handleUndo} canUndo={canUndo} />
            </div>
        </div>
    );
};