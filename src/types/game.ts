
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

export interface HistoryState {
    history: MoveEntry[];
}

export interface InfoState {
    currentPlayer: Player;
}

export interface TimerState {
    playerTimes: PlayerTimes;
    activePlayer: number;
}

export interface GameState {
    board: Board;
    players: Player[];
    currentPlayer: Player;
    mustJumpPiece: Position | null;
    hasJumpsAvailable: boolean;
    capturedCount: Record<number, number>;
    history: HistoryState;
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

export type OnMoveExecutedCallback = (moves: MoveEntry[]) => void;
export type OnTurnChangeCallback = (player: Player) => void;
export type OnWinCallback = (winner: Player) => void;
export type OnCursorActionCallback = () => void;
export type OnTimeoutCallback = (playerNum: number) => void;
export type OnTickCallback = (playerTimes: PlayerTimes) => void;
export type OnPlayAgainCallback = () => void;
export type IsBlackSquareCallback = (row: number, col: number) => boolean;
export type OnCheckerClickCallback = (row: number, col: number) => void;
export type OnCellClickCallback = (row: number, col: number) => void;
export type OnCompleteCallback = () => void;
export type GetSelectedCheckerInfoCallback = () => SelectedChecker | null;