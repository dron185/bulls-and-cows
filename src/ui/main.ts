import { generateSecret } from '../core/generateSecret.js';
import { evaluateGuess } from '../core/evaluateGuess.js';
import { isValidGuess } from '../core/isValidGuess.js';
import { createDigitValidator } from '../core/createDigitValidator.js';
import { countPossibleSecrets } from '../core/countPossibleSecrets.js';
import {
  type GameState,
  initialGameState,
  startGame,
  addGuess,
  winGame,
  resetGame,
} from '../core/state.js';
import { type RecordEntry, loadRecords, addRecord } from '../core/records.js';

const BASES = [
  { value: 2, label: 'Binary (01)' },
  { value: 8, label: 'Octal (0–7)' },
  { value: 10, label: 'Decimal (0–9)' },
  { value: 16, label: 'Hexadecimal (0–F)' },
] as const;

const LENGTHS = [2, 3, 4, 5, 6] as const;

let state: GameState = initialGameState;
let records: readonly RecordEntry[] = loadRecords();

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  children: readonly (Node | string)[] = [],
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  Object.assign(node, props);
  children.forEach((c) => node.append(c));
  return node;
};

const clear = (root: HTMLElement): void => {
  while (root.firstChild) root.removeChild(root.firstChild);
};

const renderSettings = (root: HTMLElement): void => {
  root.append(el('h1', { textContent: 'Bulls and Cows' }));

  const lengthSelect = el('select', { name: 'length' });
  LENGTHS.forEach((len) => {
    lengthSelect.append(el('option', { value: String(len), textContent: String(len) }));
  });
  lengthSelect.value = '4';

  const baseSelect = el('select', { name: 'base' });
  BASES.forEach((b) => {
    baseSelect.append(el('option', { value: String(b.value), textContent: b.label }));
  });
  baseSelect.value = '10';

  const info = el('p', { className: 'info' });

  const updateInfo = (): void => {
    const base = Number(baseSelect.value);
    const maxLen = Math.min(6, base);
    [...lengthSelect.options].forEach((opt) => {
      opt.disabled = Number(opt.value) > maxLen;
    });
    if (Number(lengthSelect.value) > maxLen) {
      lengthSelect.value = String(maxLen);
    }
    const possible = countPossibleSecrets(Number(lengthSelect.value), base);
    info.textContent = `Possible secrets: ${possible}`;
  };

  lengthSelect.addEventListener('change', updateInfo);
  baseSelect.addEventListener('change', updateInfo);
  updateInfo();

  const form = el('form', {}, [
    el('label', {}, ['Length: ', lengthSelect]),
    el('label', {}, ['Base: ', baseSelect]),
    info,
    el('button', { type: 'submit', textContent: 'Start game' }),
  ]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const length = Number(lengthSelect.value);
    const base = Number(baseSelect.value);
    const secret = generateSecret(length, base);
    state = startGame(state, { length, base }, secret, Date.now());
    renderApp(root);
  });

  root.append(form);
};

const renderGame = (root: HTMLElement): void => {
  const settings = state.settings;
  if (!settings) return;
  const { length, base } = settings;

  root.append(
    el('h1', { textContent: 'Bulls and Cows' }),
    el('p', {
      textContent: `Length: ${length} · Base: ${base} · Attempts: ${state.attempts}`,
    }),
  );

  const isDigit = createDigitValidator(base);
  const input = el('input', {
    type: 'text',
    maxLength: length,
    placeholder: `Enter ${length} digits`,
    autocomplete: 'off',
  });

  input.addEventListener('input', () => {
    const filtered = [...input.value].filter(isDigit).join('').slice(0, length);
    if (input.value !== filtered) input.value = filtered;
  });

  const error = el('p', { className: 'error' });

  const form = el('form', {}, [
    input,
    el('button', { type: 'submit', textContent: 'Guess' }),
    error,
  ]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const guess = input.value.toLowerCase();
    if (!isValidGuess(guess, length, base)) {
      error.textContent = `Enter ${length} unique valid digits`;
      return;
    }
    if (state.history.some((h) => h.guess === guess)) {
      error.textContent = 'You already tried that guess';
      return;
    }
    const { bulls, cows } = evaluateGuess(state.secret, guess);
    state = addGuess(state, { guess, bulls, cows, timestamp: Date.now() });

    if (bulls === length) {
      state = winGame(state);
      const durationMs = Date.now() - state.startedAt;
      const record: RecordEntry = {
        settings: state.settings!,
        attempts: state.attempts,
        durationMs,
        timestamp: Date.now(),
      };
      records = addRecord(records, record);
    }
    input.value = '';
    error.textContent = '';
    renderApp(root);
  });

  root.append(form);

  if (state.history.length > 0) {
    const list = el(
      'ol',
      { className: 'history' },
      state.history.map((h) =>
        el('li', {
          textContent: `${h.guess.toUpperCase()} — ${h.bulls} bulls, ${h.cows} cows`,
        }),
      ),
    );
    root.append(el('h2', { textContent: 'Attempts' }), list);
  }
};

const renderWin = (root: HTMLElement): void => {
  const durationMs = Date.now() - state.startedAt;
  const btn = el('button', { textContent: 'New game' });
  btn.addEventListener('click', () => {
    state = resetGame();
    renderApp(root);
  });
  root.append(
    el('h1', { textContent: 'You won!' }),
    el('p', {
      textContent: `Guessed in ${state.attempts} attempts · ${(durationMs / 1000).toFixed(2)}s`,
    }),
    btn,
  );
};

const renderRecords = (root: HTMLElement): void => {
  if (records.length === 0) return;
  const items = records.map((r) =>
    el('li', {
      textContent: `Len ${r.settings.length} · base ${r.settings.base} → ${r.attempts} attempts · ${(r.durationMs / 1000).toFixed(2)}s`,
    }),
  );
  root.append(el('h2', { textContent: 'Records' }), el('ol', { className: 'records' }, items));
};

const renderApp = (root: HTMLElement): void => {
  clear(root);
  if (state.status === 'settings') {
    renderSettings(root);
    renderRecords(root);
  } else if (state.status === 'playing') {
    renderGame(root);
  } else {
    renderWin(root);
    renderRecords(root);
  }
};

const container = el('div', { id: 'app' });
document.body.append(container);
renderApp(container);
