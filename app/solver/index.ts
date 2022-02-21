/* This shouldn't need to be distributed but I thought it would be fun to build some solver info
 */

import { allWords, checkWordle, CORRECT, PRESENT, WRONG } from "../wordle/";
import { countLetter } from "../wordle/validate";
let wlookup = {};
allWords.map((w) => (wlookup[w] = 1));
console.log("We have ", allWords.length, "words");
let words = Object.keys(wlookup);
console.log("Eliminated dups yields:", words.length);

export function buildMetadata(ww) {
  let positions = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    anywhere: {},
  };
  for (let ltr of "abcdefghijklmnopqrstuvwxyz") {
    for (let i = -1; i < 5; i++) {
      if (i < 0) {
        positions.anywhere[ltr] = 0;
      } else {
        positions[i][ltr] = 0;
      }
    }
  }
  for (let w of ww) {
    for (let i = 0; i < w.length; i++) {
      try {
        positions[i][w[i]] += 1;
        positions.anywhere[w[i]] += 1;
      } catch (err) {
        console.log("oops on ", i, w, w.length);
        throw err;
      }
    }
  }
  let highestVal = ww.length;
  for (let k in positions) {
    for (let ltr in positions[k]) {
      if (k == "anywhere") {
        positions[k][ltr] = (100 * positions[k][ltr]) / (5 * highestVal);
      } else {
        positions[k][ltr] = (100 * positions[k][ltr]) / highestVal;
      }
    }
  }

  return positions;
}

export function scoreWord(word, metadata): number {
  let score = 0;
  let lettersWeveSeen = {};
  for (let i = 0; i < word.length; i++) {
    score += metadata[i][word[i]];
    if (!lettersWeveSeen[word[i]]) {
      score += metadata.anywhere[word[i]];
    }
    lettersWeveSeen[word[i]] = true;
  }

  return score;
}

export function scoreWords(words, metadata) {
  let scoredWords = words.map((word) => ({
    word,
    score: scoreWord(word, metadata),
  }));
  scoredWords.sort((a, b) => b.score - a.score);
  return scoredWords;
}

export function simpleSolve(target) {
  // This is what I consider the lamest algorithm...
  // we just look for the highest frequency letters
  // in each position and guess the word that hits them...
  let guesses = [];
  let results = [];
  let wordlist = allWords;
  do {
    if (guesses.length > 0) {
      console.log("Filtering:", wordlist);
      wordlist = getPossibleWords(wordlist, guesses, results);
      console.log("After", guess, result, "we have", wordlist.length, wordlist);
      if (wordlist.length == 0) {
        console.log("FAIL!");
        console.log("No words left after", guesses);
        return { guesses, results };
      }
    }
    let metadata = buildMetadata(allWords);
    let scoredWords = scoreWords(wordlist, metadata);
    var guess = scoredWords[0].word;
    console.log("Picked guess", guess, "from options", scoredWords);
    guesses.push(guess);
    var result = checkWordle(guess, target);
    console.log("Got result", result);
    results.push(result);
  } while (target != guess && guesses.length < 10);
  return { guesses, results };
}

export function testGetWords(wordlist, guesses, target) {
  let results = guesses.map((g) => checkWordle(g, target));
  return getPossibleWords(wordlist, guesses, results);
}

function getPossibleWords(wordlist, guesses, results) {
  let slots = [
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
  ];
  let mustHave = {};
  let cantHave = {};
  for (let i = 0; i < guesses.length; i++) {
    let guess = guesses[i];
    let result = results[i];
    let guessInfo = getInfoFromResult(guess, result, slots);
    for (let ch in guessInfo.cantHave) {
      if (!cantHave[ch]) {
        cantHave[ch] = guessInfo.cantHave[ch];
      }
    }
    for (let mh in guessInfo.mustHave) {
      if (!mustHave[mh] || mustHave[mh] < guessInfo.mustHave[mh]) {
        mustHave[mh] = guessInfo.mustHave[mh];
      }
    }
  }
  console.log("Filtering based on slots: ", slots);
  console.log("Must have:", mustHave);
  console.log("Cannot have", cantHave);
  return wordlist.filter((w) => {
    for (let i = 0; i < w.length; i++) {
      if (slots[i].indexOf(w[i]) == -1) {
        return false;
      }
    }
    for (let ltr in mustHave) {
      if (countLetter(w, ltr) < mustHave[ltr]) {
        return false;
      }
    }
    for (let ltr in cantHave) {
      if (countLetter(w, ltr) >= cantHave[ltr]) {
        return false;
      }
    }
    return true;
  });
}
export function getInfoFromGuess(guess, target) {
  let result = checkWordle(guess, target);
  return getInfoFromResult(guess, result);
}
function getInfoFromResult(
  guess,
  result,
  slots: string[][] = [
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
    Array.from("abcdefghijklmnopqrstuvwxyz"),
  ]
) {
  let mustHave = {};
  let cantHave = {};
  debugger;
  for (let li = 0; li < guess.length; li++) {
    if (result[li] == CORRECT) {
      debugger;
      slots[li] = [guess[li]];
      if (mustHave[guess[li]]) {
        mustHave[guess[li]] += 1;
      } else {
        mustHave[guess[li]] = 1;
      }
      mustHave[guess[li]] = 1;
    } else if (result[li] == PRESENT) {
      if (mustHave[guess[li]]) {
        mustHave[guess[li]] += 1;
      } else {
        mustHave[guess[li]] = 1;
      }
      // Also we know it can't be in our slot...
      slots[li] = slots[li].filter((l) => l != guess[li]);
    } else if (result[li] == WRONG) {
      slots[li] = slots[li].filter((l) => l != guess[li]);
      cantHave[guess[li]] = 1;
    }
  }
  // Through the word...
  for (let ltr in cantHave) {
    if (mustHave[ltr]) {
      cantHave[ltr] = mustHave[ltr] + 1;
    }
  }
  return {
    mustHave,
    cantHave,
    slots,
  };
}

function isPossibleMatch(result, target, word, eliminated, eliminatedAfter) {
  for (let i = 0; i < word.length; i++) {
    if (eliminated.indexOf(word[i]) > -1) {
      return false;
    }
    if (result[i] == CORRECT && word[i] != target[i]) {
      return false;
    }
    if (result[i] == PRESENT && word.indexOf(target[i]) == -1) {
      return false;
    }
    /*
     * We are ignoring repeated letters for now
     */
  }
  for (let ltr in eliminatedAfter) {
    if (countLetter(word, ltr) >= eliminatedAfter) {
      return false;
    }
  }
  return true;
}
