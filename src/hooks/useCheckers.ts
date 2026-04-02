import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {gameReducer} from './reducers/gameReducer';
import {createInitialCheckersState} from '../logic/gameInitState.ts';
import {useLocalStorage} from './useLocalStorage.ts';
import type {CheckersState} from "../types/game.ts";
import {selectCapturedCount, selectValidMoves, selectWinner} from "../selectors/gameSelectors.ts";

export const useCheckers = (game: CheckersState | undefined) => {
    const { saveGameState } = useLocalStorage();

    const initGame = (): CheckersState => {
        if (game) {
            return game;
        }

        return createInitialCheckersState();
    };

    const [gameState, dispatchGame] = useReducer(gameReducer, null, initGame);
    useEffect(() => {
        if (gameState) {
            saveGameState(gameState);
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

    const canUndo = gameState.previousState !== null && selectWinner(gameState) === null;

    const handleTimeout = useCallback(() => {
        dispatchGame({ type: 'TIMEOUT' });
    }, []);

    const handleRestart = useCallback(() => {
        dispatchGame({ type: 'RESTART', payload: createInitialCheckersState() });
    }, []);

    const validMoves = useMemo(() => selectValidMoves(gameState), [gameState]);
    const winner = useMemo(() => selectWinner(gameState), [gameState]); //TODO: split into separate useReducer hooks
    const capturedCount = useMemo(() => selectCapturedCount(gameState), [gameState]); //TODO: the same as above

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