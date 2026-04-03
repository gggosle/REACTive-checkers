import { GAME_CONFIG } from '../constants.js';
import type {Position, Move, MoveEntry} from '../types/game';

function toAlgebraic(row: number, col: number): string {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const letter = letters[col];
    const rank = GAME_CONFIG.BOARD_SIZE - row;
    return `${letter}${rank}`;
}

export function createMoveNotation(moveEntry: MoveEntry): string {
    const fromAlg = toAlgebraic(moveEntry.from.row, moveEntry.from.col);
    const toAlg = toAlgebraic(moveEntry.to.row, moveEntry.to.col);

    const separator = moveEntry.isJump ? 'x' : '-';

    return `${fromAlg}${separator}${toAlg}`;
}

export function generateMoveEntry(
    playerId: number,
    from: Position,
    to: Move,
    isJump: boolean,
    promotedToKing: boolean
): MoveEntry {
    return {
        id: Date.now(),
        playerId,
        from,
        to: { row: to.row, col: to.col },
        isJump,
        promotedToKing
    };
}