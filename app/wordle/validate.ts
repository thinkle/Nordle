import {wordSize} from './constants';

function countLetter(word, letter) {
  let count = 0;
  for (let ltr of word) {
    if (ltr == letter) {
      count += 1;
    }
  }
  return count;
}

let victoryString = ""
for (let i=0; i<wordSize; i++) {
  victoryString += "🟩"
}

/**
 * Check guesses against word. Return which guess
 * was correct (1-based indexing).
 */
export function checkGuesses (guesses : string[], word : string) : number {
  let i = 1; // count
  for (let g of guesses) {
    let result = checkWordle(g, word).join('');
    if (result == victoryString) {
      return i;
    }
    i += 1;
  }
  return 0;
}

export function checkWordle(guess, word) {
  guess = guess.toLowerCase();
  word = word.toLowerCase();
  let results = [];
  let matches = {};
  for (let i = 0; i < word.length; i++) {
    let ltr = guess[i];
    if (word[i] == ltr) {
      results.push("🟩");
      if (!matches[ltr]) {
        matches[ltr] = 0;
      }
      matches[ltr] += 1;
    } else if (word.indexOf(ltr) == -1) {
      results.push("⬛");
    } else {
      results.push("?");
    }
  }
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    if (result == "?") {
      let ltr = guess[i];
      let numberInWord = countLetter(word, ltr);
      let numberAlreadyFound = matches[ltr] || 0;
      if (numberInWord - numberAlreadyFound > 0) {
        results[i] = "🟨";
        matches[ltr] = numberAlreadyFound + 1;
      } else {
        results[i] = "⬛";
      }
    }
  }
  return results;
}
