import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {gameReducer} from './reducers/gameReducer';
import {createInitialGameState} from '../logic/gameInitState.ts';
import {useLocalStorage} from './useLocalStorage.ts';
import type {GameState, SavedGameState} from "../types/game.ts";
import {selectCapturedCount, selectValidMoves, selectWinner} from "../selectors/gameSelectors.ts";
import {reconstructBoard} from "../logic/boardUtils.ts";

export const useCheckers = (savedState: SavedGameState | undefined) => {
    const { saveGame } = useLocalStorage();

    const initGame = (): GameState => {
        if (savedState && savedState.history && savedState.players && savedState.players.length > 0) {
            const restoredBoard = reconstructBoard(savedState.history);
            let activePlayer = savedState.players[0];

            if (savedState.history.length > 0) {
                const lastMove = savedState.history[savedState.history.length - 1];

                if (savedState.mustJumpPiece) {
                    activePlayer = savedState.players.find(p => p.id === lastMove.playerId) || savedState.players[0];
                } else {
                    activePlayer = savedState.players.find(p => p.id !== lastMove.playerId) || savedState.players[0];
                }
            }

            return {
                board: restoredBoard,
                players: savedState.players,
                currentPlayer: activePlayer,
                history: savedState.history,
                mustJumpPiece: savedState.mustJumpPiece || null,
                gameId: savedState.gameId || Date.now(),
                selectedPiece: null,
                isTimeOut: false,
            } as GameState;
        }

        return createInitialGameState();
    };

    const [gameState, dispatchGame] = useReducer(gameReducer, null, initGame);
    useEffect(() => {
        if (gameState) {
            saveGame(gameState);
        }
    }, [gameState, saveGame]);

    const handlePieceClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_PIECE', payload: { row, col } });
    }, []);

    const handleCellClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_CELL', payload: { row, col } });
    }, []);

    const handleUndo = useCallback(() => {
        dispatchGame({ type: 'UNDO' });
    }, []);

    const canUndo = gameState.history.length !== 0 && selectWinner(gameState) === null;

    const handleTimeout = useCallback(() => {
        dispatchGame({ type: 'TIMEOUT' });
    }, []);

    const handleRestart = useCallback(() => {
        dispatchGame({ type: 'RESTART', payload: createInitialGameState() });
    }, []);

    const validMoves = useMemo(() => selectValidMoves(gameState), [gameState]);
    const winner = useMemo(() => selectWinner(gameState), [gameState]);
    const capturedCount = useMemo(() => selectCapturedCount(gameState), [gameState]);

    return {
        ...gameState,
        validMoves,
        winner,
        capturedCount,
        handlePieceClick,
        handleCellClick,
        handleUndo,
        canUndo,
        handleTimeout,
        handleRestart
    };
};