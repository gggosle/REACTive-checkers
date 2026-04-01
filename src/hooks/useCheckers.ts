import {useCallback, useEffect, useReducer} from 'react';
import {type CheckersState, useGameReducer} from './reducers/gameReducer';
import {createInitialGameState} from '../logic/gameInitState.ts';
import {GAME_CONFIG} from "../constants.ts";

export const useCheckers = () => {

    const initGame = (): CheckersState => {
        let baseState = createInitialGameState();
        try {
            const saved = localStorage.getItem(GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY);
            if (saved) {
                baseState = JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to parse save game", e);
        }

        return {
            ...baseState,
            selectedPiece: null,
            validMoves: [],
            winner: null,
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


    const handleTimeout = useCallback((loserId: number) => {
        dispatchGame({ type: 'TIMEOUT', payload: { loserId } });
    }, []);

    const handleRestart = useCallback(() => {
        localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY);
        localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY);
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