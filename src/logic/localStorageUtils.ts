import {GAME_KEY} from "../hooks/useLocalStorage.ts";

export function getGameIdFromLocalStorage(): string | null {
    const savedGameStr = localStorage.getItem(GAME_KEY);
    if (savedGameStr) {
        try {
            const savedGame = JSON.parse(savedGameStr);
            return savedGame.gameId;
        } catch (e) {
            console.error("Failed to parse saved game state", e);
        }
    }
    return null;
}