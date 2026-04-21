export const calculateInitialPieceCount = (boardSize: number, rowsCount: number): number => {
    return Math.floor((boardSize * rowsCount) / 2);
};
