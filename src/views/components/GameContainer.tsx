import React from 'react';
import { useGame } from '../../hooks/useGame';
import { Board } from './Board';
import {GameInfo} from "./GameInfo.tsx";

export const GameContainer: React.FC = () => {
    const {
        boardState,
        currentPlayer,
        selectedPiece,
        validMoves,
        history,
        handlePieceClick,
        handleCellClick
    } = useGame();

    return (
        <div className="game-container">
            <GameInfo
                currentPlayer = {currentPlayer}
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

                <aside className="history-panel">
                    <h2 className="history-title">Move History</h2>
                    <div className="history-list-container">
                        <ul id="history-list">
                            {history.map((move, i) => (
                                <li key={i} className="history-item">
                                    {move.notation}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};