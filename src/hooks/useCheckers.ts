import { useReducer, useCallback } from 'react';
import { useGameReducer, type CheckersState } from './useGameReducer';
import { createInitialGameState } from '../logic/gameInitState.ts';

export const useCheckers = () => {

    const initGameState = (): CheckersState => {
        const baseGameState = createInitialGameState();
        return {
            ...baseGameState,
            selectedPiece: null,
            validMoves: [],
            winner: null,
        };
    };

    const [state, dispatch] = useReducer(useGameReducer, null, initGameState);

    const handlePieceClick = useCallback((row: number, col: number) => {
        dispatch({ type: 'CLICK_PIECE', payload: { row, col } });
    }, []);

    const handleCellClick = useCallback((row: number, col: number) => {
        dispatch({ type: 'CLICK_CELL', payload: { row, col } });
    }, []);

    const handleRestart = useCallback(() => {
        dispatch({ type: 'RESTART', payload: initGameState() });
    }, []);

    return {
        ...state,
        handlePieceClick,
        handleCellClick,
        handleRestart,
    };
};