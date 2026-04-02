import type {CheckersState, GameState} from "../types/game.ts";
import { createInitialBoard } from "./boardUtils.ts";
import { generatePlayers } from "./playerUtils.ts";

function createInitialGameState(): GameState {
    const initialPlayers = generatePlayers();

    return {
        board: createInitialBoard(),
        players: initialPlayers,
        currentPlayer: initialPlayers[0],
        mustJumpPiece: null,
        history: [],
        gameId: Date.now(),
    }
}

export function createInitialCheckersState(): CheckersState {
    return {
        ...createInitialGameState(),
        selectedPiece: null,
        previousState: null,
        gameId: Date.now(),
    };
}