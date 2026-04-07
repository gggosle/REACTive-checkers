import React, { memo, useState, useEffect, useRef } from 'react';
import {CSS_BOARD, GAME_CONFIG} from '../constants.ts';
import { Color, type Checker as CheckerType } from "../types/game.ts";

interface CheckerProps {
    piece: CheckerType;
    isSelected: boolean;
    onClick: (row: number, col: number) => void;
}

export const Checker: React.FC<CheckerProps> = memo(({ piece, isSelected, onClick }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const prevPos = useRef({ row: piece.row, col: piece.col });

    useEffect(() => {
        if (prevPos.current.row !== piece.row || prevPos.current.col !== piece.col) {
            setIsAnimating(true);
            prevPos.current = { row: piece.row, col: piece.col };
            const timer = setTimeout(() => setIsAnimating(false), GAME_CONFIG.ANIMATION_DURATION);

            return () => clearTimeout(timer);
        }
    }, [piece.row, piece.col]);

    const classNames = [
        CSS_BOARD.CHECKER_CLASS,
        piece.color === Color.WHITE ? CSS_BOARD.PLAYER_1_CHECKER_CLASS : CSS_BOARD.PLAYER_2_CHECKER_CLASS,
        piece.isKing ? CSS_BOARD.KING_CLASS : '',
        isSelected ? CSS_BOARD.HIGHLIGHT_CLASS : ''
    ].filter(Boolean).join(' ');

    const offset = `calc((var(--cell-size) - var(--checker-size)) / 2)`;
    const currentZIndex = isAnimating ? 50 : 10;

    const style: React.CSSProperties = {
        position: 'absolute',
        top: `calc(${piece.row} * var(--cell-size) + ${offset})`,
        left: `calc(${piece.col} * var(--cell-size) + ${offset})`,
        transition: 'top var(--transition-normal), left var(--transition-normal), transform var(--transition-fast)',
        zIndex: currentZIndex,
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
});