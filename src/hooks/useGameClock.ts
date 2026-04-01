import {useEffect, useReducer} from "react";
import {timerReducer} from "./reducers/timerReducer.ts";
import {GAME_CONFIG} from "../constants";


export const useGameClock = (activePlayerId: number | undefined, onTimeOut: (id: number) => void) => {
    const [timerState, dispatch] = useReducer(timerReducer, { playerTimes: { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME } });

    useEffect(() => {
        if (!activePlayerId) return;

        const interval = setInterval(() => {
            if (timerState.playerTimes[activePlayerId] <= 1) {
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