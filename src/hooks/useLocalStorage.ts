import { useCallback, useEffect } from 'react';
import type {MoveEntry, TimerState} from '../types/game.ts';
import {GAME_CONFIG} from "../constants.ts";

export const GAME_KEY = GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY;
export const TIMER_KEY = GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY;

export const loadGameSession = (): { history: MoveEntry[]; timer: TimerState } | null => {
    try {
        const savedGame = localStorage.getItem(GAME_KEY);
        const savedTimer = localStorage.getItem(TIMER_KEY);

        if (savedGame && savedTimer) {
            const parsedGame = JSON.parse(savedGame);
            const parsedTimer = JSON.parse(savedTimer);
            if (parsedGame.gameId === parsedTimer.gameId) {
                return { history: parsedGame, timer: parsedTimer };
            }
        }
    } catch {
        console.warn("Save data corrupted. Starting fresh.");
    }

    localStorage.removeItem(GAME_KEY);
    localStorage.removeItem(TIMER_KEY);
    return null;
};

export const useTimerEmergencySync = (timerRef: React.MutableRefObject<TimerState>) => {
    useEffect(() => {
        const saveOnExit = () => {
            localStorage.setItem(TIMER_KEY, JSON.stringify(timerRef.current));
        };

        window.addEventListener('beforeunload', saveOnExit);
        return () => window.removeEventListener('beforeunload', saveOnExit);
    }, [timerRef]);
};

export const useLocalStorage = () => {
    const saveGameState = useCallback((history: MoveEntry[]) => {
        localStorage.setItem(GAME_KEY, JSON.stringify(history));
    }, []);

    const saveTimerState = useCallback((state: TimerState) => {
        localStorage.setItem(TIMER_KEY, JSON.stringify(state));
    }, []);

    const clearStorage = useCallback(() => {
        localStorage.removeItem(GAME_KEY);
        localStorage.removeItem(TIMER_KEY);
    }, []);

    return {
        saveGameState,
        saveTimerState,
        clearStorage
    };
};