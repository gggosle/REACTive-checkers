import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLocalStorage} from './useLocalStorage.ts';
import type {GameState, Board, Player, AllowedMovesEntry} from "../types/game.ts";
import {selectCapturedCount} from "../selectors/gameSelectors.ts";
import {ApiError, GamesService, TaskStatusService} from "../api"
import type {MovePayload, TaskResponse} from "../api";
import {getGameIdFromLocalStorage} from "../logic/localStorageUtils.ts";

let initPromise: Promise<void> | null = null;

export const useCheckers = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { saveGame } = useLocalStorage();
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [showAiDelay, setShowAiDelay] = useState(false);
    const [errorModalData, setErrorModalData] = useState<{title: string; message: string} | null>(null);
    
    const lastGoodStateRef = useRef<Partial<GameState> | null>(null);
    const pollingIntervalRef = useRef<number | null>(null);

    const clearPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            window.clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    }, []);

    const startPolling = useCallback((taskId: string, gameId: string) => {
        clearPolling();
        pollingIntervalRef.current = window.setInterval(async () => {
            try {
                const status = await TaskStatusService.taskStatusRetrieve(taskId);
                if (status.status === 'finished') {
                    clearPolling();
                    setIsAiThinking(false);
                    const finalState = await GamesService.gamesRetrieve(gameId);
                    setGameState(prev => prev ? ({
                        ...prev,
                        ...finalState,
                        selectedPiece: null,
                    }) : null);
                } else if (status.status === 'failed') {
                    clearPolling();
                    setIsAiThinking(false);
                    setErrorModalData({
                        title: 'AI Error',
                        message: 'Could not get AI response',
                    });
                }
            } catch {
                clearPolling();
                setIsAiThinking(false);
                setErrorModalData({
                    title: 'Connection Error',
                    message: 'Could not get AI response',
                });
            }
        }, 3000);
    }, [clearPolling]);

    const initGame = useCallback(async () => {
        const gameId: string | null = getGameIdFromLocalStorage();

        let newState: Partial<GameState> | null = null;
        if (gameId) {
            try {
                setFetchError(null);
                newState = await GamesService.gamesRetrieve(gameId);
                lastGoodStateRef.current = newState;
            } catch (e) {
                if (e instanceof ApiError) {
                    const errorMessage = e.body?.detail || e.statusText || "Move rejected by server.";
                    setFetchError(errorMessage);
                }
            }
        }

        if (!newState) {
            newState = await GamesService.gamesCreate();
            lastGoodStateRef.current = newState;
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
            if (initPromise) {
                await initPromise;
                return;
            }

            setIsLoading(true);
            try {
                initPromise = initGame();
                await initPromise;
            } finally {
                setIsLoading(false);
                initPromise = null;
            }
        };

        void runInit();
    }, [initGame]);

    useEffect(() => {
        return () => clearPolling();
    }, [clearPolling]);

    useEffect(() => {
        if (gameState) {
            saveGame(gameState);
        }
    }, [gameState, saveGame]);

    const applyOptimisticMove = useCallback((fromPos: {row: number; col: number}, toPos: {row: number; col: number}) => {
        if (!gameState) return null;
        
        const newBoard = gameState.board.map((row) => [...row]) as Board;
        const piece = newBoard[fromPos.row][fromPos.col];
        if (!piece) return null;
        
        const midRow = (fromPos.row + toPos.row) / 2;
        const midCol = (fromPos.col + toPos.col) / 2;
        
        newBoard[toPos.row][toPos.col] = piece;
        newBoard[fromPos.row][fromPos.col] = null;
        
        const isJump = Math.abs(toPos.row - fromPos.row) === 2;
        if (isJump) {
            newBoard[midRow][midCol] = null;
        }
        
        if ((piece.direction === 1 && toPos.row === 0) || (piece.direction === -1 && toPos.row === 7)) {
            piece.isKing = true;
        }
        
        piece.row = toPos.row;
        piece.col = toPos.col;
        
        const currentPlayerId = gameState.currentPlayerId;
        const nextPlayerId = gameState.players.find((p: Player) => p.id !== currentPlayerId)?.id || 1;
        
        return {
            ...gameState,
            board: newBoard,
            currentPlayerId: nextPlayerId,
            selectedPiece: null,
            allowedMoves: null,
        };
    }, [gameState]);

    const handlePieceClick = useCallback((row: number, col: number) => {
        if (!gameState || gameState.winnerId || isLoading || isAiThinking) return;
        const piece = gameState.board[row][col];
        const currentPlayer = gameState.players.find((p: Player) => p.id === gameState.currentPlayerId);

        if (piece && piece.color === currentPlayer?.color) {
            setGameState(prev => prev ? { ...prev, selectedPiece: { row, col } } : null);
        }
    }, [gameState, isLoading, isAiThinking]);

    const handleCellClick = useCallback(async (row: number, col: number) => {
        if (!gameState || !gameState.selectedPiece || gameState.winnerId || isLoading || isAiThinking) return;

        const { row: fromRow, col: fromCol } = gameState.selectedPiece;
        const optimisticState = applyOptimisticMove({ row: fromRow, col: fromCol }, { row, col });
        
        setGameState(optimisticState);
        setIsLoading(true);

        try {
            setFetchError(null);
            const movePayload: MovePayload = {
                fromPos: gameState.selectedPiece,
                toPos: { row, col },
            };
            const response = await GamesService.gamesMoveCreate(gameState.id, movePayload);
            
            const isTaskResponse = (resp: unknown): resp is TaskResponse => {
                return typeof resp === 'object' && resp !== null && 'taskId' in resp;
            };
            
            if (isTaskResponse(response)) {
                setIsAiThinking(true);
                startPolling(response.taskId, gameState.id);
            } else {
                const responseGameState = response as GameState;
                const isAiTurn = gameState.aiPlayerId !== null && responseGameState.currentPlayerId === gameState.aiPlayerId;
                
                if (isAiTurn) {
                    setShowAiDelay(true);
                    setTimeout(() => {
                        setShowAiDelay(false);
                        setGameState(prev => prev ? ({
                            ...prev,
                            ...responseGameState,
                            selectedPiece: null,
                        }) : null);
                    }, 500);
                } else {
                    setGameState(prev => prev ? ({
                        ...prev,
                        ...responseGameState,
                        selectedPiece: null,
                    }) : null);
                }
            }
            lastGoodStateRef.current = response as GameState;
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 400) {
                    setGameState(prev => prev ? ({
                        ...prev,
                        selectedPiece: null,
                    }) : null);
                    setFetchError(error.body?.detail || "Invalid move. Try again.");
                } else {
                    const errorMessage = error.body?.detail || error.statusText || "Move rejected by server.";
                    setFetchError(errorMessage);
                    lastGoodStateRef.current = await GamesService.gamesRetrieve(gameState.id);
                    setGameState(prev => prev ? ({
                        ...prev,
                        ...lastGoodStateRef.current,
                        selectedPiece: null,
                    }) : null);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isLoading, isAiThinking, applyOptimisticMove, startPolling]);

    const handleUndo = useCallback(async () => {
        if (!gameState || gameState.winnerId || isLoading || isAiThinking) return;

        setIsLoading(true);
        try {
            setFetchError(null);
            const newState = await GamesService.gamesUndoCreate(gameState.id);
            setGameState(prev => ({
                ...prev!,
                ...newState,
                selectedPiece: null,
            }));
            lastGoodStateRef.current = newState;
        } catch (error) {
            if (error instanceof ApiError) {
                const errorMessage = error.body?.detail || error.statusText || "Move rejected by server.";
                setFetchError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isLoading, isAiThinking]);

    const handleTimeout = useCallback(() => {
        setGameState(prev => prev ? { ...prev, isTimeOut: true } : null);
    }, []);

    const handleRestart = useCallback(async () => {
        setIsLoading(true);
        try {
            setFetchError(null);
            setErrorModalData(null);
            const newState = await GamesService.gamesCreate();
            setGameState({
                ...newState,
                history: [],
                selectedPiece: null,
                isTimeOut: false,
            } as GameState);
            lastGoodStateRef.current = newState;
        } catch (error) {
            if (error instanceof ApiError) {
                const errorMessage = error.body?.detail || error.statusText || "Move rejected by server.";
                setFetchError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReloadGame = useCallback(async () => {
        if (!gameState) return;
        setErrorModalData(null);
        setIsLoading(true);
        try {
            const newState = await GamesService.gamesRetrieve(gameState.id);
            setGameState(prev => prev ? ({
                ...prev,
                ...newState,
                selectedPiece: null,
            }) : null);
            lastGoodStateRef.current = newState;
        } catch (error) {
            if (error instanceof ApiError) {
                setFetchError(error.body?.detail || error.statusText || "Could not reload game");
            }
        } finally {
            setIsLoading(false);
        }
    }, [gameState]);

    const validMoves = useMemo(() => {
        if (!gameState || !gameState.selectedPiece || !gameState.allowedMoves) return [];
        const { row, col } = gameState.selectedPiece;
        const entry = gameState.allowedMoves.find(
            (e: AllowedMovesEntry) => e.fromPos.row === row && e.fromPos.col === col
        );
        return entry ? entry.moves.map(m => ({ row: m.row, col: m.col, type: m.type, captured: m.captured })) : [];
    }, [gameState]);

    const capturedCount = useMemo(() => (gameState ? selectCapturedCount(gameState) : {}), [gameState]);
    
    const winnerId = useMemo(() => {
        if (!gameState || !gameState.winnerId) return null;
        return gameState.players.find((p: Player) => p.id === gameState.winnerId) || null;
    }, [gameState]);

    const currentPlayerIsAi = useMemo(() => {
        if (!gameState || gameState.aiPlayerId === null) return false;
        return gameState.currentPlayerId === gameState.aiPlayerId;
    }, [gameState]);

    return {
        fetchError,
        errorModalData,
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
        isAiThinking: isAiThinking || showAiDelay,
        currentPlayerIsAi,
        handlePieceClick,
        handleCellClick,
        handleUndo,
        canUndo: !winnerId && !isLoading && !isAiThinking,
        handleTimeout,
        handleRestart,
        handleReloadGame,
        dismissError: () => setFetchError(null),
        dismissErrorModal: () => setErrorModalData(null),
    };
};