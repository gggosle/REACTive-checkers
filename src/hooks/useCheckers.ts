import {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocalStorage} from './useLocalStorage.ts';
import type {GameState} from "../types/game.ts";
import {selectCapturedCount, selectValidMoves} from "../selectors/gameSelectors.ts";
import {ApiService} from "../api"
import type {MovePayload} from "../api";
import {getGameIdFromLocalStorage} from "../logic/localStorageUtils.ts";

export const useCheckers = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { saveGame } = useLocalStorage();

    const initGame = useCallback(async () => {
        let gameId: string | null = getGameIdFromLocalStorage();

        let newState: Partial<GameState> | null = null;
        if (gameId) {
            try {
                newState = await ApiService.apiGamesRetrieve(gameId);
            } catch (e) {
                console.error("Failed to fetch game, creating new one", e);
            }
        }

        if (!newState) {
            newState = await ApiService.apiGamesCreate();
        }

        const fullState: GameState = {
            ...newState,
            history: [],
            selectedPiece: null,
            isTimeOut: false,
        } as GameState;

        setGameState(fullState);
    }, []);

    useEffect(() => {
        const runInit = async () => {
            setIsLoading(true);
            try {
                await initGame();
            } catch (error) {
                console.error("Initialization error", error);
            } finally {
                setIsLoading(false);
        }};
         void runInit();
    }, [initGame]);

    useEffect(() => {
        if (gameState) {
            saveGame(gameState);
        }
    }, [gameState, saveGame]);

    const handlePieceClick = useCallback((row: number, col: number) => {
        if (!gameState || gameState.winnerId || isLoading) return;
        const piece = gameState.board[row][col];
        const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);

        if (piece && piece.color === currentPlayer?.color) {
            setGameState(prev => prev ? { ...prev, selectedPiece: { row, col } } : null);
        }
    }, [gameState, isLoading]);

    const handleCellClick = useCallback(async (row: number, col: number) => {
        if (!gameState || !gameState.selectedPiece || gameState.winnerId || isLoading) return;

        setIsLoading(true);
        try {
            const movePayload: MovePayload = {
                fromPos: gameState.selectedPiece,
                toPos: { row, col },
            }
            const newState = await ApiService.apiGamesMoveCreate(gameState.id, movePayload);
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
        if (!gameState || gameState.winnerId || isLoading) return;

        setIsLoading(true);
        try {
            const newState = await ApiService.apiGamesUndoCreate(gameState.id);
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
            const newState = await ApiService.apiGamesCreate();
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
    
    const winnerId = useMemo(() => {
        if (!gameState || !gameState.winnerId) return null;
        return gameState.players.find(p => p.id === gameState.winnerId) || null;
    }, [gameState]);

    return {
        ...gameState,
        board: gameState?.board || [],
        players: gameState?.players || [],
        currentPlayerId: gameState?.currentPlayerId || 0,
        history: gameState?.history || [],
        gameId: gameState?.id || '',
        selectedPiece: gameState?.selectedPiece || null,
        validMoves,
        winnerId,
        capturedCount,
        isLoading,
        handlePieceClick,
        handleCellClick,
        handleUndo,
        canUndo: !winnerId && !isLoading,
        handleTimeout,
        handleRestart
    };
};