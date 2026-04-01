import {GAME_CONFIG} from "../constants.ts";
import type {TimerState} from "../types/game.ts";
import type {CheckersState} from "../hooks/reducers/gameReducer.ts";

export const loadGameSession = (): { game: CheckersState; timer: TimerState } | null => {
    try {
        const savedGame = localStorage.getItem(GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY);
        const savedTimer = localStorage.getItem(GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY);

        if (savedGame && savedTimer) {
            const parsedGame = JSON.parse(savedGame);
            const parsedTimer = JSON.parse(savedTimer);
            if(parsedGame.gameId === parsedTimer.gameId) {
                return { game: parsedGame, timer: parsedTimer };
            }
        }
    } catch (e) {
        console.warn("Save data corrupted. Starting fresh.");
    }

    localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_GAME_STATE_KEY);
    localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_TIMER_STATE_KEY);
    return null;
};