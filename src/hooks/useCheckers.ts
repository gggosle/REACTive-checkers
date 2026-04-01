import { useReducer, useCallback } from 'react';
import { useGameReducer, type CheckersState } from './reducers/gameReducer';
import { timerReducer, type TimerState } from './reducers/timerReducer';
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

    const initTimer = (): TimerState => {
        return {
            playerTimes: { 1: 300, 2: 300 }
        };
    };

    const [gameState, dispatchGame] = useReducer(useGameReducer, null, initGame);
    const [timerState, dispatchTimer] = useReducer(timerReducer, null, initTimer);

    const handlePieceClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_PIECE', payload: { row, col } });
    }, []);

    const handleCellClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_CELL', payload: { row, col } });
    }, []);

    const handleTick = useCallback(() => {
        if (!gameState.winner) {
            dispatchTimer({
                type: 'TICK',
                payload: { activePlayerId: gameState.currentPlayer.id }
            });
        }
    }, [gameState.winner, gameState.currentPlayer.id]);

    const handleTimeout = useCallback((loserId: number) => {
        dispatchGame({ type: 'TIMEOUT', payload: { loserId } });
    }, []);

    const handleRestart = useCallback(() => {
        dispatchGame({ type: 'RESTART', payload: initGame() });
        dispatchTimer({ type: 'RESTART_TIMER', payload: initTimer() });
    }, []);

    return {
        ...gameState,
        ...timerState,
        handlePieceClick,
        handleCellClick,
        handleTick,
        handleTimeout,
        handleRestart
    };
};