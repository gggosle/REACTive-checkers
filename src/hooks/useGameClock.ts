import { useEffect, useReducer, useRef } from "react";
import { timerReducer } from "./reducers/timerReducer.ts";
import { GAME_CONFIG } from "../constants";
import type { TimerState } from "../types/game.ts";

export const useGameClock = (
    activePlayerId: number | undefined,
    gameId: number,
    onTimeOut: () => void,
    timer: TimerState | undefined
) => {

    const initTimer = (initialTimer: TimerState | undefined): TimerState => {
        if (initialTimer && initialTimer.gameId === gameId) {
            return initialTimer;
        }

        return {
            playerTimes: { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME },
            gameId: gameId
        };
    };

    const [timerState, dispatch] = useReducer(timerReducer, timer, initTimer);

    const latestTimerRef = useRef(timerState);
    useEffect(() => {
        latestTimerRef.current = timerState;
    }, [timerState]);

    useEffect(() => {
        localStorage.setItem(GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY, JSON.stringify(latestTimerRef.current));
    }, [activePlayerId]);

    useEffect(() => {
        const saveOnExit = () => {
            localStorage.setItem(GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY, JSON.stringify(latestTimerRef.current));
        };

        window.addEventListener('beforeunload', saveOnExit);
        return () => window.removeEventListener('beforeunload', saveOnExit);
    }, []);

    useEffect(() => {
        if (!activePlayerId) return;

        const interval = setInterval(() => {
            const currentTime = latestTimerRef.current.playerTimes[activePlayerId];

            if (currentTime <= 1) {
                clearInterval(interval);
                dispatch({ type: 'TICK', payload: { activePlayerId } });
                onTimeOut();
            } else {
                dispatch({ type: 'TICK', payload: { activePlayerId } });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activePlayerId, onTimeOut]);

    return timerState;
}