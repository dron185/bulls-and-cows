export interface Settings {
  readonly length: number;
  readonly base: number;
}

export interface GuessEntry {
  readonly guess: string;
  readonly bulls: number;
  readonly cows: number;
  readonly timestamp: number;
}

export type GameStatus = 'settings' | 'playing' | 'won';

export interface GameState {
  readonly status: GameStatus;
  readonly settings: Settings | null;
  readonly secret: string;
  readonly history: readonly GuessEntry[];
  readonly startedAt: number;
  readonly attempts: number;
}

export const initialGameState: GameState = {
  status: 'settings',
  settings: null,
  secret: '',
  history: [],
  startedAt: 0,
  attempts: 0,
};

export const startGame = (
  state: GameState,
  settings: Settings,
  secret: string,
  now: number,
): GameState => ({
  ...state,
  status: 'playing',
  settings,
  secret,
  history: [],
  startedAt: now,
  attempts: 0,
});

export const addGuess = (state: GameState, entry: GuessEntry): GameState => ({
  ...state,
  history: [...state.history, entry],
  attempts: state.attempts + 1,
});

export const winGame = (state: GameState): GameState => ({
  ...state,
  status: 'won',
});

export const resetGame = (): GameState => initialGameState;
