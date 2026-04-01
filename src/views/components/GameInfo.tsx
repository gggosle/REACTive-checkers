import type { Player } from '../../types/game.ts'
import {TimerController} from "./TimerController.tsx";


interface GameInfoProps {
    currentPlayer: Player;
    players: Player[];
    capturedCount: Record<number, number>;
    winner: Player | null;
    gameId: number;
    onTimeOut: (loserId: number) => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ currentPlayer,
                                                      players,
                                                      capturedCount,
                                                      winner,
                                                      gameId,
                                                      onTimeOut }) => {


    return (
        <header className="header">
            <h1 className="title">CHECKERS</h1>

            <div className="turn-indicator">
                    <span className={`turn-dot ${currentPlayer.color}`}></span>
                    <span id="turn-text">{currentPlayer.name}'s Turn</span>
            </div>
            <TimerController
                key={gameId}
                activePlayerId={winner ? undefined : currentPlayer.id}
                players={players}
                onTimeOut={onTimeOut}
            />
            <div className="info-container">
                {players.map(player => (
                    <div key={player.id} className="info-cell">
                        <span className={`turn-dot ${player.color}`} style={{ width: '12px', height: '12px', animation: 'none' }}></span>
                        <span>{player.name}:</span>
                        <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                            {capturedCount[player.id]}
                        </span>
                    </div>
                ))}
            </div>
        </header>
    );
};