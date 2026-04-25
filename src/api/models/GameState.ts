/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllowedMovesEntry } from './AllowedMoves';
export type GameState = {
    readonly id: string;
    /**
     * Stores the 8x8 matrix of the board
     */
    readonly board: any;
    /**
     * The current Player object's id
     */
    readonly currentPlayerId: number;
    /**
     * Array of 2 Player instances
     */
    readonly players: any;
    /**
     * {row: int, col: int} if multi-jump locked
     */
    readonly mustJumpPiece: any;
    /**
     * Cached allowed moves for current player (from backend)
     */
    readonly allowedMoves: AllowedMovesEntry[] | null;
    /**
     * Player id controlled by AI in single-player
     */
    readonly aiPlayerId: number | null;
    /**
     * ID of the winning player
     */
    readonly winnerId: number | null;
};

