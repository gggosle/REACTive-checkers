import {useEffect, useReducer, useRef} from "react";
import {timerReducer} from "./reducers/timerReducer.ts";
import {GAME_CONFIG} from "../constants";
import type {TimerState} from "../types/game.ts";


const initTimer = (): TimerState => {
    const saved = localStorage.getItem('timer_state');
    if (saved) return JSON.parse(saved);

    return { playerTimes: { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME } };
};

export const useGameClock = (activePlayerId: number | undefined, onTimeOut: (id: number) => void) => {
    const [timerState, dispatch] = useReducer(timerReducer, initTimer());

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
            if (timerState.playerTimes[activePlayerId] == 0) {
                clearInterval(interval);
                onTimeOut(activePlayerId);
            } else {
                dispatch({ type: 'TICK', payload: { activePlayerId } });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activePlayerId, timerState.playerTimes, onTimeOut]);

    return timerState;
}