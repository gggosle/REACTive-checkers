export const GAME_CONFIG = {
    BOARD_SIZE: 8,
    LOCAL_STORAGE_GAME_STATE_KEY: 'checkers_state',
    LOCAL_STORAGE_TIMER_STATE_KEY: 'timer_state',
    DEFAULT_GAME_TIME: 600,
    ANIMATION_DURATION: 400,
};

export const GAME_RULES = {
    PIECE_ROWS_COUNT: 3,
    MOVE_DIR_UP: 1,
    MOVE_DIR_DOWN: -1,
    PLAYER_1_ID: 1,
    PLAYER_2_ID: 2,
};

export const CSS_BOARD = {
    BOARD_CLASS: 'board',
    UNDO_BTN: 'undo-btn',
    CELL_CLASS: 'cell',
    BLACK_CELL_CLASS: 'color-2-cell',
    WHITE_CELL_CLASS: 'color-1-cell',
    CHECKER_CLASS: 'checker',
    PLAYER_1_CHECKER_CLASS: 'white-piece',
    PLAYER_2_CHECKER_CLASS: 'black-piece',
    KING_CLASS: 'king',
    HIGHLIGHT_CLASS: 'highlight',
    VALID_MOVE_CLASS: 'valid-move',
    CURSOR_CLASS: 'keyboard-cursor',
};

export const CSS_HISTORY = {
    ITEM_CLASS: 'history-item',
    SELECTED_CLASS: 'selected',
    HIGHLIGHT_CLASS: 'history-highlight',
};

export const Color = {
    WHITE: 'white',
    BLACK: 'black'
} as const;