import React, {memo} from 'react';
import { CSS_BOARD } from '../../constants';

interface CellProps {
    row: number;
    col: number;
    isBlack: boolean;
    isValidMove: boolean;
    onClick: (row: number, col: number) => void;
}

export const Cell: React.FC<CellProps> = memo(({
                                                                      row,
                                                                      col,
                                                                      isBlack,
                                                                      isValidMove,
                                                                      onClick,
                                                                  }) => {
    const classNames = [
        CSS_BOARD.CELL_CLASS,
        isBlack ? CSS_BOARD.BLACK_CELL_CLASS : CSS_BOARD.WHITE_CELL_CLASS,
        isValidMove ? CSS_BOARD.VALID_MOVE_CLASS : ''
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classNames}
            data-row={row}
            data-col={col}
            onClick={() => isValidMove && onClick(row, col)}
        />
    );
})