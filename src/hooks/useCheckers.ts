import {useState, useCallback, useRef} from 'react';
import type {GameState, Move, SelectedChecker, Player} from '../types/game.ts';

export const useCheckers = () => {
    const gameRef = useRef(new GameState());
    const game = gameRef.current;

    const [boardState, setBoardState] = useState(game.boardClone);
    const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer);
    const [selectedPiece, setSelectedPiece] = useState<SelectedChecker | null>(null);
    const [capturedCount, setCapturedCount] = useState(game.capturedCount);
    const [validMoves, setValidMoves] = useState<Move[]>([]);
    const [history, setHistory] = useState(game.moveHistory);
    const [winner, setWinner] = useState<Player | null>(null);

    const handlePieceClick = useCallback((row: number, col: number) => {
        if (winner) return;
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
        if (!selectedPiece || winner) return;

        const move = validMoves.find(m => m.row === row && m.col === col);
        if (!move) return;

        game.executeMove(selectedPiece, move);

        setBoardState(game.boardClone);
        setCurrentPlayer(game.currentPlayer);
        setCapturedCount(game.capturedCount);
        setHistory(game.moveHistory);

        if (game.mustJumpPiece) {
            setSelectedPiece(game.mustJumpPiece);
            setValidMoves(game.getValidMoves(game.mustJumpPiece.row, game.mustJumpPiece.col));
        } else {
            setSelectedPiece(null);
            setValidMoves([]);

            if (!game.hasAnyValidMoves(game.currentTurnDir)) {
                const winningPlayer = game.players.find(p => p.id !== game.currentPlayer.id) || null;
                setWinner(winningPlayer);
            }
        }
    }, [game, selectedPiece, validMoves, winner]);

    const handleRestart = useCallback(() => {
        game.reset();
        setBoardState(game.boardClone);
        setCurrentPlayer(game.currentPlayer);
        setHistory(game.moveHistory);
        setCapturedCount(game.capturedCount);
        setWinner(null);
        setSelectedPiece(null);
        setValidMoves([]);
    }, [game]);

    return {
        boardState,
        currentPlayer,
        players: game.players,
        capturedCount,
        selectedPiece,
        validMoves,
        history,
        winner,
        handlePieceClick,
        handleCellClick,
        handleRestart,
    };
};