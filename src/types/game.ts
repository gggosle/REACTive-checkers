import type {Color} from "../constants.ts";
import type {AllowedMovesEntry} from "../api";

export type CheckerColor = typeof Color[keyof typeof Color];

export interface Position {
    row: number;
    col: number;
}

export type Player = {
    id: number;
    name: string;
    color: CheckerColor;
    moveDir: number;
};

export interface Checker {
    id: string;
    color: CheckerColor;
    row: number;
    col: number;
    direction: number;
    isKing: boolean;
}

export type Board = (Checker | null)[][];

export type SelectedChecker = Position;

export interface Move extends Position {
    type: string;
    captured: Position | null;
}

export interface MoveEntry {
    id: number;
    playerId: number;
    from: Position;
    to: Position;
    isJump: boolean;
    promotedToKing: boolean;
}

export interface PlayerTimes {
    1: number;
    2: number;
    [key: number]: number;
}

export type HistoryState = MoveEntry[];

export interface TimerState {
    playerTimes: PlayerTimes;
    gameId: string;
}

export interface GameState {
    board: Board;
    players: Player[];
    currentPlayerId: number;
    mustJumpPiece: Position | null;
    allowedMoves: AllowedMovesEntry[] | null;
    aiPlayerId: number | null;
    history: HistoryState;
    id: string;
    selectedPiece: SelectedChecker | null;
    isTimeOut: boolean;
    winnerId: number | null;
}

export interface SavedGameState {
    gameId: string;
}


