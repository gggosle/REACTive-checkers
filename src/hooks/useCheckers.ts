import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {gameReducer} from './reducers/gameReducer';
import {createInitialGameState} from '../logic/gameInitState.ts';
import {useLocalStorage} from './useLocalStorage.ts';
import type {GameState, MoveEntry} from "../types/game.ts";
import {selectCapturedCount, selectValidMoves, selectWinner} from "../selectors/gameSelectors.ts";

export const useCheckers = (history: MoveEntry[] | undefined) => {
    const { saveGameState } = useLocalStorage();

    const initGame = (): GameState => {
        if (history) {
            return createInitialGameState(history);
        }

        return createInitialGameState();
    };

    const [gameState, dispatchGame] = useReducer(gameReducer, null, initGame);
    useEffect(() => {
        if (gameState) {
            saveGameState(gameState.history);
        }
    }, [gameState, saveGameState]);

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