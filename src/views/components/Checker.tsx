import React, {memo} from 'react';
import { CSS_BOARD } from '../../constants';
import {Color, type Checker as CheckerType} from "../../types/game.ts";

interface CheckerProps {
    piece: CheckerType;
    isSelected: boolean;
    onClick: (row: number, col: number) => void;
}

export const Checker: React.FC<CheckerProps> = memo(({ piece, isSelected, onClick }) => {
    const classNames = [
        CSS_BOARD.CHECKER_CLASS,
        piece.color === Color.WHITE ? CSS_BOARD.PLAYER_1_CHECKER_CLASS : CSS_BOARD.PLAYER_2_CHECKER_CLASS,
        piece.isKing ? CSS_BOARD.KING_CLASS : '',
        isSelected ? CSS_BOARD.HIGHLIGHT_CLASS : ''
    ].filter(Boolean).join(' ');

    const offset = `calc((var(--cell-size) - var(--checker-size)) / 2)`;

    const style: React.CSSProperties = {
        position: 'absolute',
        top: `calc(${piece.row} * var(--cell-size) + ${offset})`,
        left: `calc(${piece.col} * var(--cell-size) + ${offset})`,
        transition: 'top var(--transition-normal), left var(--transition-normal), transform var(--transition-fast)',
        zIndex: isSelected ? 100 : 10,
        margin: 0
    };

    return (
        <div
            className={classNames}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                onClick(piece.row, piece.col);
            }}
        />
    );
})