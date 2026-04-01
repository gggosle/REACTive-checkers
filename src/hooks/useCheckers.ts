import {useCallback, useEffect, useReducer} from 'react';
import {type CheckersState, useGameReducer} from './reducers/gameReducer';
import {createInitialGameState} from '../logic/gameInitState.ts';
import {GAME_CONFIG} from "../constants.ts";

export const useCheckers = (game: CheckersState | undefined) => {
    const initGame = (): CheckersState => {
        if (game) {
            return game;
        }
        const baseState = createInitialGameState();

        return {
            ...baseState,
            selectedPiece: null,
            validMoves: [],
            winner: null,
        };
    };

    const createFreshGame = (): CheckersState => {
        return {
            ...createInitialGameState(),
            selectedPiece: null,
            validMoves: [],
            winner: null,
            gameId: Date.now(),
        };
    };

    const [gameState, dispatchGame] = useReducer(useGameReducer, null, initGame);
    useEffect(() => {
        if (gameState) {
            localStorage.setItem(GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY, JSON.stringify(gameState));
        }
    }, [gameState]);

    const handlePieceClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_PIECE', payload: { row, col } });
    }, []);

    const handleCellClick = useCallback((row: number, col: number) => {
        dispatchGame({ type: 'CLICK_CELL', payload: { row, col } });
    }, []);


    const handleTimeout = useCallback(() => {
        dispatchGame({ type: 'TIMEOUT' });
    }, []);

    const handleRestart = useCallback(() => {
        localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY);
        localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY);
        dispatchGame({ type: 'RESTART', payload: createFreshGame() });
    }, []);

    return {
        ...gameState,
        handlePieceClick,
        handleCellClick,
        handleTimeout,
        handleRestart
    };
};