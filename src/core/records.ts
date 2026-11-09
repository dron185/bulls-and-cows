import type { Settings } from './state.js';

export interface RecordEntry {
  readonly settings: Settings;
  readonly attempts: number;
  readonly durationMs: number;
  readonly timestamp: number;
}

const STORAGE_KEY = 'bulls-and-cows-records';
const MAX_RECORDS = 10;

export const loadRecords = (): readonly RecordEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecordEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveRecords = (records: readonly RecordEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* ignore quota errors */
  }
};

const isBetter = (a: RecordEntry, b: RecordEntry): boolean =>
  a.attempts !== b.attempts ? a.attempts < b.attempts : a.durationMs < b.durationMs;

export const addRecord = (
  records: readonly RecordEntry[],
  entry: RecordEntry,
): readonly RecordEntry[] => {
  const updated = [...records, entry]
    .sort((a, b) => (isBetter(a, b) ? -1 : isBetter(b, a) ? 1 : 0))
    .slice(0, MAX_RECORDS);
  saveRecords(updated);
  return updated;
};
