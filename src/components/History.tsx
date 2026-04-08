import {createMoveNotation} from "../logic/historyUtils.ts"
import type {HistoryState} from "../types/game.ts";
import React from "react";


export interface HistoryProps {
    history: HistoryState,
}

export const History: React.FC<HistoryProps> = ({ history }) => {
    return (
        <aside className="history-panel">
            <h2 className="history-title">Move History</h2>
            <div className="history-list-container">
                <ul id="history-list">
                    {history.map((move, i) => {
                        const turnPrefix = `${i + 1}. `;
                        const text = createMoveNotation(move)

                        return (
                            <li key={move.id} className="history-item">
                                {turnPrefix + text}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
};