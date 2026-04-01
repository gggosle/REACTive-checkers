export interface TimerState {
    playerTimes: Record<number, number>;
}

export type TimerAction =
    | { type: 'TICK'; payload: { activePlayerId: number } }

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
    switch (action.type) {
        case 'TICK': {
            const id = action.payload.activePlayerId;
            const currentTime = state.playerTimes[id];

            if (currentTime <= 0) return state;

            return {
                ...state,
                playerTimes: {
                    ...state.playerTimes,
                    [id]: currentTime - 1
                }
            };
        }
        default:
            return state;
    }
};