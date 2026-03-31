import React from 'react';
import type {HistoryState} from "../../types/game.ts";

interface HistoryProps {
    history: HistoryState;
}

export const History: React.FC<HistoryProps> = ({ history }) => {
    return (
        <aside className="history-panel">
            <h2 className="history-title">Move History</h2>
            <div className="history-list-container">
                <ul id="history-list">
                    {history.map((move, i) => (
                        <li key={i} className="history-item">
                            {move.notation}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};