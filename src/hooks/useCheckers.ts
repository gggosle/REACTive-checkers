import {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocalStorage, GAME_KEY} from './useLocalStorage.ts';
import type {GameState} from "../types/game.ts";
import {selectCapturedCount, selectValidMoves} from "../selectors/gameSelectors.ts";
import {api} from "../services/api.ts";

export const useCheckers = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { saveGame } = useLocalStorage();

    const initGame = useCallback(async () => {
        setIsLoading(true);
        try {
            const savedGameStr = localStorage.getItem(GAME_KEY);
            let gameId: string | null = null;
            if (savedGameStr) {
                try {
                    const savedGame = JSON.parse(savedGameStr);
                    gameId = savedGame.gameId;
                } catch (e) {
                    console.error("Failed to parse saved game state", e);
                }
            }

            let newState: Partial<GameState> | null = null;
            if (gameId) {
                try {
                    newState = await api.fetchGame(gameId);
                } catch (e) {
                    console.error("Failed to fetch game, creating new one", e);
                }
            }

            if (!newState) {
                newState = await api.initializeGame();
            }

            const fullState: GameState = {
                ...newState,
                history: [],
                selectedPiece: null,
                isTimeOut: false,
            } as GameState;

            setGameState(fullState);
        } catch (error) {
            console.error("Initialization error", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        if (gameState) {
            saveGame(gameState);
        }
    }, [gameState, saveGame]);

    const handlePieceClick = useCallback((row: number, col: number) => {
        if (!gameState || gameState.winner || isLoading) return;
        const piece = gameState.board[row][col];
        if (piece && piece.color === gameState.currentPlayer.color) {
            setGameState(prev => prev ? { ...prev, selectedPiece: { row, col } } : null);
        }
    }, [gameState, isLoading]);

    const handleCellClick = useCallback(async (row: number, col: number) => {
        if (!gameState || !gameState.selectedPiece || gameState.winner || isLoading) return;

        setIsLoading(true);
        try {
            const newState = await api.attemptMove(gameState.gameId, gameState.selectedPiece, { row, col });
            setGameState(prev => ({
                ...prev!,
                ...newState,
                selectedPiece: null,
            }));
        } catch (error) {
            console.error("Move error", error);
            setGameState(prev => prev ? { ...prev, selectedPiece: null } : null);
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isLoading]);

    const handleUndo = useCallback(async () => {
        if (!gameState || gameState.winner || isLoading) return;

        setIsLoading(true);
        try {
            const newState = await api.undoMove(gameState.gameId);
            setGameState(prev => ({
                ...prev!,
                ...newState,
                selectedPiece: null,
            }));
        } catch (error) {
            console.error("Undo error", error);
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isLoading]);

    const handleTimeout = useCallback(() => {
        setGameState(prev => prev ? { ...prev, isTimeOut: true } : null);
    }, []);

    const handleRestart = useCallback(async () => {
        setIsLoading(true);
        try {
            const newState = await api.initializeGame();
            setGameState({
                ...newState,
                history: [],
                selectedPiece: null,
                isTimeOut: false,
            } as GameState);
        } catch (error) {
            console.error("Restart error", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const validMoves = useMemo(() => (gameState ? selectValidMoves(gameState) : []), [gameState]);
    const capturedCount = useMemo(() => (gameState ? selectCapturedCount(gameState) : {}), [gameState]);
    
    const winner = useMemo(() => {
        if (!gameState || !gameState.winner) return null;
        return gameState.players.find(p => p.id === gameState.winner) || null;
    }, [gameState]);

    return {
        ...gameState,
        board: gameState?.board || [],
        players: gameState?.players || [],
        currentPlayer: gameState?.currentPlayer || { id: 0, name: '', color: 'white' as any, moveDir: 0 },
        history: gameState?.history || [],
        gameId: gameState?.gameId || '',
        validMoves,
        winner,
        capturedCount,
        isLoading,
        handlePieceClick,
        handleCellClick,
        handleUndo,
        canUndo: !winner && !isLoading,
        handleTimeout,
        handleRestart
    };
};