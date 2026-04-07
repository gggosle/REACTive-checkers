import { GAME_CONFIG } from '../constants.js';
import type {GameState, Move, Position, Checker, Board, Player} from '../types/game';
import {generateMoveEntry} from "./historyUtils.ts";

export function isBlackSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 1;
}

export function isInBounds(row: number, col: number): boolean {
    return row >= 0 && row < GAME_CONFIG.BOARD_SIZE && col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
}

export function getPiece(board: Board, row: number, col: number): Checker | null {
    if (!isInBounds(row, col)) return null;
    return board[row][col];
}

export function getPossibleDirections(piece: Checker): { dr: number; dc: number }[] {
    const directions = piece.isKing ? [1, -1] : [piece.direction];
    const moves: { dr: number; dc: number }[] = [];

    for (const dr of directions) {
        for (const dc of [1, -1]) {
            moves.push({ dr, dc });
        }
    }

    return moves;
}

export function tryCalculateJump(board: Board, piece: Checker, targetPiece: Checker, dr: number, dc: number): Move | null {
    if (targetPiece.direction === piece.direction) return null;

    const jumpRow = targetPiece.row + dr;
    const jumpCol = targetPiece.col + dc;

    if (isInBounds(jumpRow, jumpCol) && !getPiece(board, jumpRow, jumpCol)) {
        return {
            row: jumpRow,
            col: jumpCol,
            type: 'jump',
            captured: { row: targetPiece.row, col: targetPiece.col }
        };
    }
    return null;
}

export function calculateTargetMove(board: Board, piece: Checker, row: number, col: number, dr: number, dc: number): Move | null {
    const targetRow = row + dr;
    const targetCol = col + dc;

    if (!isInBounds(targetRow, targetCol)) return null;

    const targetPiece = getPiece(board, targetRow, targetCol);
    if (!targetPiece) {
        return { row: targetRow, col: targetCol, type: 'move', captured: null };
    }

    return tryCalculateJump(board, piece, targetPiece, dr, dc);
}

export function hasJumpAvailable(board: Board, row: number, col: number): boolean {
    const piece = getPiece(board, row, col);
    if (!piece) return false;

    const directions = getPossibleDirections(piece);
    for (const { dr, dc } of directions) {
        const move = calculateTargetMove(board, piece, row, col, dr, dc);
        if (move?.type === 'jump') return true;
    }

    return false;
}

export function calculatePotentialMoves(board: Board, row: number, col: number): Move[] {
    const piece = getPiece(board, row, col);
    if (!piece) return [];

    const moves: Move[] = [];
    const directions = getPossibleDirections(piece);

    for (const { dr, dc } of directions) {
        const move = calculateTargetMove(board, piece, row, col, dr, dc);
        if (move) moves.push(move);
    }

    return moves;
}

export function getValidMoves(
    board: Board,
    playerMoveDir: number,
    mustJumpPiece: Position | null,
    hasJumpsAvailable: boolean,
    row: number,
    col: number
): Move[] {
    const piece = getPiece(board, row, col);
    if (!piece || piece.direction !== playerMoveDir) return [];

    if (mustJumpPiece && (mustJumpPiece.row !== row || mustJumpPiece.col !== col)) {
        return [];
    }

    const moves = calculatePotentialMoves(board, row, col);

    if (hasJumpsAvailable) {
        return moves.filter(m => m.type === 'jump');
    }

    return moves;
}

export function anyPlayerJumpsAvailable(board: Board, playerMoveDir: number): boolean {
    for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
        for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
            const piece = getPiece(board, r, c);
            if (piece && piece.direction === playerMoveDir) {
                if (hasJumpAvailable(board, r, c)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function hasAnyValidMoves(
    board: Board,
    playerMoveDir: number,
    mustJumpPiece: Position | null,
    hasJumpsAvailable: boolean
): boolean {
    for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
        for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
            const piece = getPiece(board, r, c);
            if (piece && piece.direction === playerMoveDir) {
                if (getValidMoves(board, playerMoveDir, mustJumpPiece, hasJumpsAvailable, r, c).length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function checkPromotion(piece: Checker, targetRow: number): boolean {
    if (piece.isKing) return false;
    return (piece.direction === 1 && targetRow === GAME_CONFIG.BOARD_SIZE - 1) ||
        (piece.direction === -1 && targetRow === 0);
}

export function applyMove(state: GameState, from: Position, toMove: Move): GameState {
    const piece = getPiece(state.board, from.row, from.col);
    if (!piece) return state;

    const newBoard = state.board.map(row => [...row]);
    const newHistory = [...state.history];
    const isJump = toMove.type === 'jump';
    const isPromoted = checkPromotion(piece, toMove.row);

    const movedPiece = { ...piece, row: toMove.row, col: toMove.col };
    newBoard[from.row][from.col] = null;
    newBoard[toMove.row][toMove.col] = movedPiece;

    newHistory.push(generateMoveEntry(state.currentPlayer.id, from, toMove,
        isJump, isPromoted));

    if (isJump && toMove.captured) {
        newBoard[toMove.captured.row][toMove.captured.col] = null;
    }

    if (isPromoted) {
        movedPiece.isKing = true;
    }

    if (isJump && !isPromoted) {
        if (hasJumpAvailable(newBoard, toMove.row, toMove.col)) {
            return {
                ...state,
                board: newBoard,
                history: newHistory,
                mustJumpPiece: { row: toMove.row, col: toMove.col }
            };
        }
    }

    const nextPlayer = state.players.find(p => p.id !== state.currentPlayer.id) || state.players[0];

    return {
        ...state,
        board: newBoard,
        history: newHistory,
        mustJumpPiece: null,
        currentPlayer: nextPlayer
    };
}

export function calculateValidMoves (state: GameState): Move[] {
    if (!state.selectedPiece) return [];
    const jumpsAvailable = calculateJumpsAvailable(state);

    return getValidMoves(
        state.board,
        state.currentPlayer.moveDir,
        state.mustJumpPiece,
        jumpsAvailable,
        state.selectedPiece.row,
        state.selectedPiece.col
    );
}

export function calculateWinner (state: GameState): Player | null  {
    if (state.isTimeOut) {
        return state.players.find(p => p.id !== state.currentPlayer.id) || null;
    }
    const jumpsAvailable = calculateJumpsAvailable(state);

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
}

export function calculateJumpsAvailable (state: GameState): boolean  {
    return anyPlayerJumpsAvailable(state.board, state.currentPlayer.moveDir);
}
