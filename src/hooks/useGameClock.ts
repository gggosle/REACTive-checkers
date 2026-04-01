import {useEffect, useReducer} from "react";
import {timerReducer} from "./reducers/timerReducer.ts";

export const useGameClock = (activePlayerId: number, onTimeOut: (id: number) => void) => {
    const [timerState, dispatch] = useReducer(timerReducer, { playerTimes: { 1: 300, 2: 300 } });

    useEffect(() => {
        // If there is no active player (game over), stop ticking
        if (!activePlayerId) return;

        const interval = setInterval(() => {
            if (timerState.playerTimes[activePlayerId] <= 1) {
                clearInterval(interval);
                onTimeOut(activePlayerId); // Tell the GameContainer someone lost!
            } else {
                dispatch({ type: 'TICK', payload: { activePlayerId } });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activePlayerId, timerState.playerTimes, onTimeOut]);

    return timerState;
}