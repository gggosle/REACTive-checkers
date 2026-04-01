import { useReducer, useCallback } from 'react';
import { useGameReducer, type CheckersState } from './reducers/gameReducer';
import { createInitialGameState } from '../logic/gameInitState.ts';

export const useCheckers = () => {

    const initGame = (): CheckersState => {
        const baseState = createInitialGameState();
        return {
            ...baseState,
            selectedPiece: null,
            validMoves: [],
            winner: null,
        };
    };

    const [gameState, dispatchGame] = useReducer(useGameReducer, null, initGame);

    const handlePieceClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_PIECE', payload: { row, col } });
    }, []);

    const handleCellClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_CELL', payload: { row, col } });
    }, []);


    const handleTimeout = useCallback((loserId: number) => {
        dispatchGame({ type: 'TIMEOUT', payload: { loserId } });
    }, []);

    const handleRestart = useCallback(() => {
        dispatchGame({ type: 'RESTART', payload: initGame() });
    }, []);

    return {
        ...gameState,
        handlePieceClick,
        handleCellClick,
        handleTimeout,
        handleRestart
    };
};