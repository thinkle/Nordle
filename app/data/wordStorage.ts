import { dateKey, getDateKey } from "../wordle/get_words";
import { checkGuesses } from "../wordle/";

export function getWords(n) {
  let key = `${dateKey}-${n}`;
  try {
    let value = JSON.parse(localStorage.getItem(key));
    if (value && value.length) {
      return value;
    } else {
      if (value) {
        console.log("bad value?", value);
      }
      return [];
    }
  } catch (err) {
    return [];
  }
}

export function getStreak(n: number) {
  let currentStreak = localStorage.getItem(`streak-${n}`) || 0;
  currentStreak = n + Number(currentStreak);
  localStorage.setItem(`streak-${n}`, `${currentStreak}`);
  return currentStreak;
}

export function addToStreak(n: number) {
  let streak = getStreak(n) + 1;
  localStorage.setItem(`streak-${n}`, `${streak}`);
  return streak;
}

export function saveWords(n: number, words: String[]) {
  let key = `${dateKey}-${n}`;
  let val = JSON.stringify(words);
  localStorage.setItem(key, val);
  console.log("Saved", n, words);
}
