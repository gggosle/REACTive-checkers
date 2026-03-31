import type {Move, SelectedChecker, Player, GameState, Checker} from '../types/game.ts';
import {getValidMoves, hasAnyValidMoves, applyMove, getPiece} from '../logic/gameRules';

export interface CheckersState extends GameState {
    selectedPiece: SelectedChecker | null;
    validMoves: Move[];
    winner: Player | null;
}

export type CheckersAction =
    | { type: 'CLICK_PIECE'; payload: { row: number; col: number } }
    | { type: 'CLICK_CELL'; payload: { row: number; col: number } }
    | { type: 'RESTART'; payload: CheckersState };

export const useGameReducer = (state: CheckersState, action: CheckersAction): CheckersState => {
    switch (action.type) {
        case 'CLICK_PIECE': {
            const { row, col } = action.payload;

            if (state.winner) return state;

            const piece : Checker | null = getPiece(state.board, row, col);

            if (!piece || piece.direction !== state.currentPlayer.moveDir) return state;

            if (state.selectedPiece?.row === row && state.selectedPiece?.col === col && !state.mustJumpPiece) {
                return {
                    ...state,
                    selectedPiece: null,
                    validMoves: []
                };
            }

            const moves = getValidMoves(state.board, state.currentPlayer.moveDir, state.mustJumpPiece, state.hasJumpsAvailable, row, col);

            if (moves.length > 0) {
                return {
                    ...state,
                    selectedPiece: { row, col },
                    validMoves: moves
                };
            }

            return state;
        }

        case 'CLICK_CELL': {
            const { row, col } = action.payload;

            if (!state.selectedPiece || state.winner) return state;

            const move = state.validMoves.find(m => m.row === row && m.col === col);

            if (!move) return state;

            const nextGameState = applyMove(state, state.selectedPiece, move);

            let nextSelectedPiece = null;
            let nextValidMoves: Move[] = [];
            let nextWinner : Player | null = state.winner;

            if (nextGameState.mustJumpPiece) {
                nextSelectedPiece = nextGameState.mustJumpPiece;
                nextValidMoves = getValidMoves(nextGameState.board, nextGameState.currentPlayer.moveDir, nextGameState.mustJumpPiece, nextGameState.hasJumpsAvailable, nextGameState.mustJumpPiece.row, nextGameState.mustJumpPiece.col);
            } else {
                if (!hasAnyValidMoves(nextGameState.board, nextGameState.currentPlayer.moveDir, nextGameState.mustJumpPiece, nextGameState.hasJumpsAvailable)) {
                    nextWinner = nextGameState.players.find((p: Player) => p.id !== nextGameState.currentPlayer.id) || null;
                }
            }

            return {
                ...state,
                ...nextGameState,
                selectedPiece: nextSelectedPiece,
                validMoves: nextValidMoves,
                winner: nextWinner,
            };
        }

        case 'RESTART': {
            return action.payload;
        }

        default:
            return state;
    }
};