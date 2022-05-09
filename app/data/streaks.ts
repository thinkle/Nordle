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
  datekey?: number;
};

export function loadGame({
  n = 0,
  key = "",
  datekey = null,
}: {
  n?: number;
  key?: string;
  datekey?: number;
}) {
  if (!key && !datekey) {
    datekey = dateKey; // global
  }
  if (!key) {
    key = `${datekey}-${n}-gameinfo`;
  }
  if (key && !datekey) {
    datekey = Number(key.split("-")[0]);
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
    return getGameInfo(guesses, targets, datekey);
  }
}

export function storeGame(guesses: string[], targets: string[]): GameInfo {
  localStorage.setItem(
    dateKey + "-" + targets.length + "-gameinfo",
    JSON.stringify({ targets, guesses })
  );
  return getGameInfo(guesses, targets);
}

export function getGameInfo(
  guesses: string[],
  targets: string[],
  datekey?: number
): GameInfo {
  localStorage.save;
  let totalGuesses = 5 + targets.length;
  let results = targets.map((t) => checkGuesses(guesses, t));
  let nsolved = results.filter((n) => n > 0).length;
  return {
    n: targets.length,
    targets,
    guesses,
    results,
    datekey,
    number_solved: nsolved,
    complete: nsolved == targets.length || totalGuesses == guesses.length,
    success: nsolved == targets.length,
  };
}

export type StreakInfo = {
  n: number;
  currentStreak: number;
  longestStreak: number;
  longestStreakStart: number;
  attempted: number;
  solved: number;
  wordsSolved: number;
};

export function getStreak(n) {
  let streakInfo: StreakInfo = {
    n,
    currentStreak: 0,
    longestStreak: 0,
    longestStreakStart: -1,
    attempted: 0,
    solved: 0,
    wordsSolved: 0,
  };
  let allGames = getItemsForN(n);
  let longestStreak = [];
  let currentStreak = [];
  let streak = [];
  for (let g of allGames) {
    streakInfo.attempted += 1;
    streakInfo.wordsSolved += g.number_solved;
    if (g.success) {
      streakInfo.solved += 1;
    }
    if (streak.length == 0) {
      streak.push(g);
      if (g.datekey == dateKey) {
        currentStreak = streak;
      }
    } else {
      let lastGame = streak[streak.length - 1];
      // If we are building our streak, add to it...
      if (lastGame.datekey - g.datekey == 1) {
        streak.push(g);
        if (g.datekey == dateKey) {
          currentStreak = streak;
        }
      } else {
        // ending a streak...
        if (streak.length > longestStreak.length) {
          // new longest!
          longestStreak = streak;
        }
        // reset the streak we are tracking...
        streak = [];
      }
    }
  }
  if (longestStreak.length) {
    streakInfo.longestStreak = longestStreak.length;
    streakInfo.longestStreakStart = longestStreak[0].datekey;
  }
  streakInfo.currentStreak = currentStreak.length;
  return streakInfo;
}

export function getItemsForN(n: number): GameInfo[] {
  let results = [];
  let todaysKeyRegexp = new RegExp(`[0-9]+-${n}-gameinfo`);
  for (let key in localStorage) {
    if (key.match(todaysKeyRegexp)) {
      results.push(loadGame({ key }));
    }
  }
  results.sort((a, b) => b.datekey - a.datekey);
  return results;
}

export function getItemsForToday(): GameInfo[] {
  let results = [];
  let todaysKeyRegexp = new RegExp(`${dateKey}-[0-9]+-gameinfo`);
  for (let key in localStorage) {
    if (key.match(todaysKeyRegexp)) {
      results.push(loadGame({ key }));
    }
  }
  results.sort((a, b) => a.n - b.n);
  return results;
}
