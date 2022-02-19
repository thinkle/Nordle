/**
 * Storing streaks for nordle, not so simple
 * is it :)
 *
 * We can compute streaks from words, but our
 * word list will be updated occasionally, which
 * will break back calculations, so that's
 * not reliable, which means we need to store
 * actual information about how they did.
 *
 * Purest solution...
 * Per date per n we store...
 * {
 *   targets : [...],
 *   guesses : [...],
 * }
 *
 * From that we compute:
 * -> How many were solved correctly
 * -> Were guesses exhausted.
 *
 * Meaning we can provide an object like this
 * {
 *   n : 3,
 *   targets : [...],
 *   guesses : [...],
 *   solutions : #,
 *   complete : true|false,
 *   success : true|false
 * }
 * We can then compute/store for each n...
 *
 * streak-n : {
 *    longest-streak : #,
 *    current-streak-start : null | date,
 * }
 *
 *  */
import { dateKey, getDateKey } from "../wordle/get_words";
import { checkGuesses } from "../wordle/";

export type GameInfo = {
  n: number;
  targets: string[];
  guesses: string[];
  results: number[];
  number_solved: number;
  complete: boolean;
  success: boolean;
};

export function getStreakInfo(n: number): {
  longestStreak: number;
  currentStreakStart: null | Date;
} {
  return {
    longestStreak: 0,
    currentStreakStart: null,
  };
}

export function loadGame({
  n = 0,
  key = "",
  dateKey = "",
}: {
  n?: number;
  key?: string;
  dateKey?: string;
}) {
  if (!key) {
    key = `${dateKey}-${n}-gameinfo`;
  }
  let result = localStorage.getItem(key);
  if (result) {
    try {
      var { guesses, targets } = JSON.parse(result);
    } catch (err) {
      console.log("Bad value stored for gameinfo", dateKey, n);
      console.log(result);
      return null;
    }
    return getGameInfo(guesses, targets);
  }
}

export function storeGame(guesses: string[], targets: string[]): GameInfo {
  localStorage.setItem(
    dateKey + "-" + targets.length + "-gameinfo",
    JSON.stringify({ targets, guesses })
  );
  return getGameInfo(guesses, targets);
}

export function getGameInfo(guesses: string[], targets: string[]): GameInfo {
  localStorage.save;
  let totalGuesses = 5 + targets.length;
  let results = targets.map((t) => checkGuesses(guesses, t));
  let nsolved = results.filter((n) => n > 0).length;
  return {
    n: targets.length,
    targets,
    guesses,
    results,
    number_solved: nsolved,
    complete: nsolved == targets.length || totalGuesses == guesses.length,
    success: nsolved == targets.length,
  };
}

export function getItemsForToday(): GameInfo[] {
  let results = [];
  let todaysKeyRegexp = new RegExp(`${dateKey}-[0-9]+-gameinfo`);
  for (let key in localStorage) {
    console.log("Test", key, "against", todaysKeyRegexp);
    if (key.match(todaysKeyRegexp)) {
      console.log("Got a key!");
      results.push(loadGame({ key }));
    }
  }
  results.sort((a, b) => a.n - b.n);
  return results;
}
