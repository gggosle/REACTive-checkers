import {useCallback, useEffect, useReducer} from 'react';
import {type CheckersState, gameReducer} from './reducers/gameReducer';
import {createInitialCheckersState} from '../logic/gameInitState.ts';
import {useLocalStorage} from './useLocalStorage.ts';

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

    const canUndo = gameState.previousState !== null && gameState.winner === null;

    const handleTimeout = useCallback(() => {
        dispatchGame({ type: 'TIMEOUT' });
    }, []);

    const handleRestart = useCallback(() => {
        dispatchGame({ type: 'RESTART', payload: createInitialCheckersState() });
    }, []);


    return {
        ...gameState,
        handlePieceClick,
        handleCellClick,
        handleUndo,
        canUndo,
        handleTimeout,
        handleRestart
    };
};