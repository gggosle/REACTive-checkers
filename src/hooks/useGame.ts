import { useState, useCallback } from 'react';
import { GameModel } from '../models/GameModel';
import type {Move, SelectedChecker} from '../models/interfaces';

export const useGame = () => {
    const [game] = useState(() => new GameModel());

    const [boardState, setBoardState] = useState(game.boardClone);
    const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer);
    const [selectedPiece, setSelectedPiece] = useState<SelectedChecker | null>(null);
    const [validMoves, setValidMoves] = useState<Move[]>([]);
    const [history, setHistory] = useState(game.moveHistory);

    const handlePieceClick = useCallback((row: number, col: number) => {
        const piece = game.getPiece(row, col);
        if (!piece || piece.direction !== game.currentTurnDir) return;

        if (selectedPiece?.row === row && selectedPiece?.col === col && !game.mustJumpPiece) {
            setSelectedPiece(null);
            setValidMoves([]);
            return;
        }

        const moves = game.getValidMoves(row, col);
        if (moves.length > 0) {
            setSelectedPiece({ row, col });
            setValidMoves(moves);
        }
    }, [game, selectedPiece]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (!selectedPiece) return;

        const move = validMoves.find(m => m.row === row && m.col === col);
        if (!move) return;

        game.executeMove(selectedPiece, move);

        setBoardState(game.boardClone);
        setCurrentPlayer(game.currentPlayer);
        setHistory(game.moveHistory);

        if (game.mustJumpPiece) {
            setSelectedPiece(game.mustJumpPiece);
            setValidMoves(game.getValidMoves(game.mustJumpPiece.row, game.mustJumpPiece.col));
        } else {
            setSelectedPiece(null);
            setValidMoves([]);
        }
    }, [game, selectedPiece, validMoves]);

    return {
        boardState,
        currentPlayer,
        selectedPiece,
        validMoves,
        history,
        handlePieceClick,
        handleCellClick
    };
};