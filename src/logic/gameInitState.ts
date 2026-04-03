import type {Board, GameState, MoveEntry} from "../types/game.ts";
import {createInitialBoard, reconstructBoard} from "./boardUtils.ts";
import { generatePlayers } from "./playerUtils.ts";


export function createInitialGameState(history: MoveEntry[] = []): GameState {
    const initialPlayers = generatePlayers();
    let board: Board;

    if (history.length > 0) {
        board = reconstructBoard(history);
    }
    else {
        board = createInitialBoard();
    }

    return {
        board,
        players: initialPlayers,
        currentPlayer: initialPlayers[0],
        mustJumpPiece: null,
        history: [],
        gameId: Date.now(),
        selectedPiece: null,
        isTimeOut: false,
    }
}


