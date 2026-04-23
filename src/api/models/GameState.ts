/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GameState = {
    readonly id: string;
    /**
     * Stores the 8x8 matrix of the board
     */
    board: any;
    /**
     * The current Player object's id
     */
    currentPlayerId: number;
    /**
     * Array of 2 Player instances
     */
    players: any;
    /**
     * {row: int, col: int} if multi-jump locked
     */
    mustJumpPiece?: any;
    /**
     * ID of the winning player
     */
    winnerId?: number | null;
};

