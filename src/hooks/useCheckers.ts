import {useCallback, useEffect, useReducer} from 'react';
import {type CheckersState, gameReducer} from './reducers/gameReducer';
import {createInitialGameState} from '../logic/gameInitState.ts';
import {useLocalStorage} from './useLocalStorage.ts';

export const useCheckers = (game: CheckersState | undefined) => {
    const { saveGameState, clearStorage } = useLocalStorage();

    const initGame = (): CheckersState => {
        if (game) {
            return game;
        }

        return createFreshGame();
    };

    const createFreshGame = (): CheckersState => {
        return {
            ...createInitialGameState(),
            selectedPiece: null,
            validMoves: [],
            previousState: null,
            winner: null,
            gameId: Date.now(),
        };
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
        clearStorage();
        dispatchGame({ type: 'RESTART', payload: createFreshGame() });
    }, [clearStorage]);


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