import type { GameState } from "../types/game.ts";
import { createInitialBoard } from "./boardUtils.ts";
import { generatePlayers } from "./playerUtils.ts";
import type {CheckersState} from "../hooks/reducers/gameReducer.ts";

function createInitialGameState(): GameState {
    const initialPlayers = generatePlayers();

    return {
        board: createInitialBoard(),
        players: initialPlayers,
        currentPlayer: initialPlayers[0],
        mustJumpPiece: null,
        hasJumpsAvailable: false,
        capturedCount: {1: 0, 2: 0},
        history: [],
        gameId: Date.now(),
    }
}

export function createInitialCheckersState(): CheckersState {
    return {
        ...createInitialGameState(),
        selectedPiece: null,
        validMoves: [],
        previousState: null,
        winner: null,
        gameId: Date.now(),
    };
}