/**
 * Dictionary utilities for loading words and definitions
 */

export interface WordData {
  word: string;
  definitions: string[];
}

export async function loadWordList(): Promise<WordData[]> {
  const response = await fetch('/data/word_list.json');
  const wordList: WordData[] = await response.json();
  return wordList;
}

export function getDayNumber(referenceDate: Date = new Date('2025-01-01')): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  referenceDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function getWordOfTheDay(): Promise<WordData> {
  const wordList = await loadWordList();
  const dayNumber = getDayNumber();
  const index = dayNumber % wordList.length;
  return wordList[index];
}
