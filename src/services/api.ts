import type {GameState, Position} from '../types/game';

const API_BASE_URL = 'http://localhost:8000';

interface BackendPlayer {
    id: number;
    name: string;
    color: string;
    move_dir: number;
}

interface BackendGameState {
    id: string;
    board: any[][];
    current_player: BackendPlayer;
    players: BackendPlayer[];
    must_jump_piece: { row: number, col: number } | null;
    winner: number | null;
}

const mapBackendToFrontend = (data: BackendGameState): Partial<GameState> => {
    return {
        gameId: data.id,
        board: data.board,
        currentPlayer: {
            id: data.current_player.id,
            name: data.current_player.name,
            color: data.current_player.color as any,
            moveDir: data.current_player.move_dir,
        },
        players: data.players.map(p => ({
            id: p.id,
            name: p.name,
            color: p.color as any,
            moveDir: p.move_dir,
        })),
        mustJumpPiece: data.must_jump_piece ? { row: data.must_jump_piece.row, col: data.must_jump_piece.col } : null,
        winner: data.winner,
    };
};

export const api = {
    async initializeGame(): Promise<Partial<GameState>> {
        const response = await fetch(`${API_BASE_URL}/api/games/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to initialize game');
        const data: BackendGameState = await response.json();
        return mapBackendToFrontend(data);
    },

    async fetchGame(gameId: string): Promise<Partial<GameState>> {
        const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/`);
        if (!response.ok) {
             if (response.status === 404) {
                 throw new Error('Game not found');
             }
             throw new Error('Failed to fetch game');
        }
        const data: BackendGameState = await response.json();
        return mapBackendToFrontend(data);
    },

    async attemptMove(gameId: string, fromPos: Position, toPos: Position): Promise<Partial<GameState>> {
        const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/move/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from_pos: { row: fromPos.row, col: fromPos.col },
                to_pos: { row: toPos.row, col: toPos.col },
            }),
        });
        if (!response.ok) {
             const errorData = await response.json().catch(() => ({}));
             throw new Error(errorData.detail || 'Invalid move');
        }
        const data: BackendGameState = await response.json();
        return mapBackendToFrontend(data);
    },

    async undoMove(gameId: string): Promise<Partial<GameState>> {
        const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/undo/`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to undo move');
        const data: BackendGameState = await response.json();
        return mapBackendToFrontend(data);
    },
};
