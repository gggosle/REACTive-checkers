import type { CheckersState, Player, Move } from '../types/game';
import {
    getValidMoves,
    hasAnyValidMoves,
    anyPlayerJumpsAvailable
} from '../logic/gameRules';
import {calculateInitialPieceCount} from "../logic/boardUtils.ts";
import {GAME_CONFIG, GAME_RULES} from "../constants.ts";

const CHECKERS_NUMBER = calculateInitialPieceCount(GAME_CONFIG.BOARD_SIZE, GAME_RULES.PIECE_ROWS_COUNT);

export const selectHasJumpsAvailable = (state: CheckersState): boolean => {
    return anyPlayerJumpsAvailable(state.board, state.currentPlayer.moveDir);
};

export const selectValidMoves = (state: CheckersState): Move[] => {
    if (!state.selectedPiece) return [];
    const jumpsAvailable = selectHasJumpsAvailable(state);

    return getValidMoves(
        state.board,
        state.currentPlayer.moveDir,
        state.mustJumpPiece,
        jumpsAvailable,
        state.selectedPiece.row,
        state.selectedPiece.col
    );
};

export const selectWinner = (state: CheckersState): Player | null => {
    if (state.isTimeOut) {
        return state.players.find(p => p.id !== state.currentPlayer.id) || null; //TODO: a separate helper fn findRival
    }
    const jumpsAvailable = selectHasJumpsAvailable(state);

    const canCurrentPlayerMove = hasAnyValidMoves(
        state.board,
        state.currentPlayer.moveDir,
        state.mustJumpPiece,
        jumpsAvailable
    );

    if (!canCurrentPlayerMove) {
        return state.players.find(p => p.id !== state.currentPlayer.id) || null;
    }

    return null;
};

export const selectCapturedCount = (state: CheckersState): Record<string, number> => {
    let p0PiecesOnBoard = 0;
    let p1PiecesOnBoard = 0;

    const p0Dir = state.players[0].moveDir;
    const p1Dir = state.players[1].moveDir;

    for (let r = 0; r < state.board.length; r++) {
        for (let c = 0; c < state.board[r].length; c++) {
            const piece = state.board[r][c];
            if (piece) {
                if (piece.direction === p0Dir) p0PiecesOnBoard++;
                if (piece.direction === p1Dir) p1PiecesOnBoard++;
            }
        }
    }

    return {
        [state.players[0].id]: CHECKERS_NUMBER - p1PiecesOnBoard,
        [state.players[1].id]: CHECKERS_NUMBER - p0PiecesOnBoard
    };
};