import {useEffect, useReducer, useRef} from "react";
import {timerReducer} from "./reducers/timerReducer.ts";
import {GAME_CONFIG} from "../constants";
import type {TimerState} from "../types/game.ts";

export const useGameClock = (activePlayerId: number | undefined, onTimeOut: () => void, timer: TimerState | undefined) => {
    const initTimer = (): TimerState => {
        if (timer) return timer;
        return { playerTimes: { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME } };
    };

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
                onTimeOut();
            } else {
                dispatch({ type: 'TICK', payload: { activePlayerId } });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activePlayerId, timerState.playerTimes, onTimeOut]);

    return timerState;
}