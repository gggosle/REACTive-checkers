import {GAME_RULES} from '../constants.js';
import {Color, type Player} from "../types/game.ts";

export class PlayerGenerator {
    static generatePlayers() : Player[] {
        const player1: Player = {
            id: GAME_RULES.PLAYER_1_ID,
            name: 'Player 1',
            color: Color.WHITE,
            moveDir: GAME_RULES.MOVE_DIR_UP,
        };
        const player2: Player = {
            id: GAME_RULES.PLAYER_2_ID,
            name: 'Player 2',
            color: Color.BLACK,
            moveDir: GAME_RULES.MOVE_DIR_DOWN,
        }
        return [player1, player2];
    }
}
