import { GAME_CONFIG, GAME_RULES } from '../constants.js';
import type {Board, Checker, MoveEntry} from '../types/game';
import {isBlackSquare} from "./gameRules.ts";


function generatePieceId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function createInitialBoard(): Board {
    const board: Board = [];

    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
        const rowArray: (Checker | null)[] = [];

        for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            if (!isBlackSquare(row, col)) {
                rowArray.push(null);
                continue;
            }

            if (row < GAME_RULES.PIECE_ROWS_COUNT) {
                rowArray.push({
                    id: generatePieceId(),
                    color: 'white',
                    row,
                    col,
                    direction: GAME_RULES.MOVE_DIR_UP,
                    isKing: false
                });
            } else if (row >= GAME_CONFIG.BOARD_SIZE - GAME_RULES.PIECE_ROWS_COUNT) {
                rowArray.push({
                    id: generatePieceId(),
                    color: 'black',
                    row,
                    col,
                    direction: GAME_RULES.MOVE_DIR_DOWN,
                    isKing: false
                });
            } else {
                rowArray.push(null);
            }
        }
        board.push(rowArray);
    }

    return board;
}

export const calculateInitialPieceCount = (boardSize: number, rowsCount: number): number => {
    return Math.floor((boardSize * rowsCount) / 2);
};

export function reconstructBoard(history: MoveEntry[]): Board {
    const currentBoard = createInitialBoard();

    for (const entry of history) {
        const piece = currentBoard[entry.from.row][entry.from.col];
        if (!piece) continue;

        const movedPiece = { ...piece, row: entry.to.row, col: entry.to.col };
        currentBoard[entry.from.row][entry.from.col] = null;
        currentBoard[entry.to.row][entry.to.col] = movedPiece;

        if (entry.isJump) {
            const capturedRow = (entry.from.row + entry.to.row) / 2;
            const capturedCol = (entry.from.col + entry.to.col) / 2;
            currentBoard[capturedRow][capturedCol] = null;
        }

        if (entry.promotedToKing) {
            movedPiece.isKing = true;
        }
    }

    return currentBoard;
}
