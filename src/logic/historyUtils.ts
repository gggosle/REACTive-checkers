import { GAME_CONFIG } from '../constants.js';
import type {Position, Move, MoveEntry} from '../types/game';

function toAlgebraic(row: number, col: number): string {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const letter = letters[col];
    const rank = GAME_CONFIG.BOARD_SIZE - row;
    return `${letter}${rank}`;
}

function createMoveNotation(from: Position, to: Move, currentHistoryLength: number): string {
    const turnNumber = Math.floor(currentHistoryLength / 2) + 1;
    const prefix = `${turnNumber}. `;
    const fromAlg = toAlgebraic(from.row, from.col);
    const toAlg = toAlgebraic(to.row, to.col);

    const separator = to.type === 'jump' ? 'x' : '-';

    return `${prefix}${fromAlg}${separator}${toAlg}`;
}

export function generateMoveEntry(from: Position, to: Move, currentHistoryLength: number): MoveEntry {
    return {
        notation: createMoveNotation(from, to, currentHistoryLength),
        from,
        to,
    }
}