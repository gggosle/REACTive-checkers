
export const Color = Object.freeze({
    WHITE: 'white',
    BLACK: 'black'
});

export const MoveType = Object.freeze({
    MOVE: 'move',
    JUMP: 'jump'
});

export interface Position {
    row: number;
    col: number;
}

export type Player = {
    id: number;
    name: string;
    color: string;
    moveDir: number;
};

export interface Checker {
    id: string;
    color: string;
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
    gameId: number;
}

export interface GameState {
    board: Board;
    players: Player[];
    currentPlayer: Player;
    mustJumpPiece: Position | null;
    history: HistoryState;
    gameId: number;
    selectedPiece: SelectedChecker | null;
    isTimeOut: boolean;
}

export interface SavedGameState {
    gameId: number;
    history: HistoryState;
    players: Player[];
    mustJumpPiece: Position | null;
}


