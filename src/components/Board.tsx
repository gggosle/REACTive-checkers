import React, { useMemo } from 'react';
import { GAME_CONFIG } from '../constants.ts';
import type {Move, SelectedChecker, Checker as CheckerType} from "../types/game.ts";
import { Cell } from './Cell.tsx';
import { Checker } from './Checker.tsx';

interface BoardProps {
    boardState: (CheckerType | null)[][];
    selectedPiece: SelectedChecker | null;
    validMoves: Move[];
    onPieceClick: (row: number, col: number) => void;
    onCellClick: (row: number, col: number) => void;
}

export const Board: React.FC<BoardProps> = ({ boardState, selectedPiece, validMoves, onPieceClick, onCellClick }) => {

    const activePieces = useMemo(() => {
        const flatList: CheckerType[] = [];
        boardState.forEach(row => row.forEach(piece => {
            if (piece) flatList.push(piece);
        }));
        return flatList.sort((a, b) => a.id.localeCompare(b.id));
    }, [boardState]);

    const renderGrid = () => {
        const cells = [];
        for (let r = 0; r < GAME_CONFIG.BOARD_SIZE; r++) {
            for (let c = 0; c < GAME_CONFIG.BOARD_SIZE; c++) {
                const isBlackSquare = (r + c) % 2 !== 0;
                const isValidMove = validMoves.some(m => m.row === r && m.col === c);
                cells.push(
                    <Cell
                        key={`cell-${r}-${c}`}
                        row={r} col={c}
                        isBlack={isBlackSquare}
                        isValidMove={isValidMove}
                        onClick={onCellClick}
                    />
                );
            }
        }
        return cells;
    };

    return (
        <div id="board" style={{ position: 'relative' }}>
            {renderGrid()}

            {activePieces.map(piece => {
                const isSelected = selectedPiece?.row === piece.row && selectedPiece?.col === piece.col;
                return (
                    <Checker
                        key={piece.id}
                        piece={piece}
                        isSelected={isSelected}
                        onClick={onPieceClick}
                    />
                );
            })}
        </div>
    );
};