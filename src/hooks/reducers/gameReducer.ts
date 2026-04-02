import type {Checker, CheckersState, Move} from '../../types/game.ts';
import {applyMove, getPiece} from '../../logic/gameRules';
import {selectValidMoves, selectWinner} from "../../selectors/gameSelectors.ts";


export type CheckersAction =
    | { type: 'CLICK_PIECE'; payload: { row: number; col: number } }
    | { type: 'CLICK_CELL'; payload: { row: number; col: number } }
    | { type: 'UNDO' }
    | { type: 'TIMEOUT' }
    | { type: 'RESTART'; payload: CheckersState };

export const gameReducer = (state: CheckersState, action: CheckersAction): CheckersState => {
    switch (action.type) {
        case 'CLICK_PIECE': {
            const { row, col } = action.payload;

            if (selectWinner(state)) return state;

            const piece : Checker | null = getPiece(state.board, row, col);
            if (!piece || piece.direction !== state.currentPlayer.moveDir) return state;

            if (state.selectedPiece?.row === row && state.selectedPiece?.col === col && !state.mustJumpPiece) {
                return {
                    ...state,
                    selectedPiece: null,
                };
            }

            const moves = selectValidMoves({
                ...state,
                selectedPiece: { row, col },
            });
            if (moves.length > 0) {
                console.log("damn")
                return {
                    ...state,
                    selectedPiece: { row, col },
                };
            }

            return state;
        }

        case 'CLICK_CELL': {
            const { row, col } = action.payload;

            if (!state.selectedPiece || selectWinner(state)) return state;

            const move = selectValidMoves(state).find((m: Move) => m.row === row && m.col === col);

            if (!move) return state;

            const nextGameState = applyMove(state, state.selectedPiece, move);

            let nextSelectedPiece = null;

            if (nextGameState.mustJumpPiece) {
                nextSelectedPiece = nextGameState.mustJumpPiece;
            }

            return {
                ...state,
                ...nextGameState,
                previousState: state,
                selectedPiece: nextSelectedPiece,
            };
        }

        case 'UNDO': {
            if (!state.previousState) return state;

            return {
                ...state.previousState,
                previousState: null
            };
        }

        case 'TIMEOUT': {
            return {
                ...state,
                isTimeOut: true,
            };
        }

        case 'RESTART': {
            return action.payload;
        }

        default:
            return state;
    }
};