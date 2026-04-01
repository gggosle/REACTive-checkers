
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
    notation: string;
    from: Position;
    to: Position;
}

export interface PlayerTimes {
    1: number;
    2: number;
    [key: number]: number;
}

export type HistoryState = MoveEntry[];

export interface InfoState {
    currentPlayer: Player;
}

export interface TimerState {
    playerTimes: PlayerTimes;
}

export interface GameState {
    board: Board;
    players: Player[];
    currentPlayer: Player;
    mustJumpPiece: Position | null;
    hasJumpsAvailable: boolean;
    capturedCount: Record<number, number>;
    history: HistoryState;
    gameId: number;
}

export interface ClonedState {
    board: (Checker | null)[][];
    currentPlayer: Player;
    mustJumpPiece: Position | null;
    hasJumpsAvailable: boolean;
    moveHistory: MoveEntry[];
}

export interface LiveState extends ClonedState {
    playerTimes?: PlayerTimes;
}
