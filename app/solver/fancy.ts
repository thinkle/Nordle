import {
  buildMetadata,
  getInfoFromResults,
  allwords,
  getPossibleWords,
} from "./basic";
import type { GuessInfo, Metadata } from "./basic";
import { words } from "../wordle/words";
import { checkWordle, CORRECT, PRESENT, WRONG } from "../wordle";
// Fany solver...

/*
 * So for our fancy solver, we want to rate guesses by how much information
 * they provide us.
 *
 * So guessing a green square provides 0 new information.
 * Guessing a yellow square provides some, and so on...
 * We guess maximal information guesses until we have one word left.
 *
 * Given a possible wordlist, how do we determine what letter gives the
 * most information?
 *
 * Let's say we know there's an E at the end of the word and a C at the start.
 *
 * We have a bunch of options like...
 *
 * CLOSE
 * CLAVE
 * CRONE
 * CRAVE
 * CRATE
 * CREPE
 * CHASE
 * CHAFE
 *
 * So the computer should look for the word that gives us the most information based on those
 * guesses and guess that instead of the regular word...
 */

// tares wins with our full dictionary
// irate wins with our limited dictionary
//let first = 'tares'; // hard coded - best average words left with all words
// let first = 'oater'; // best worst-case scenario w/ wordle words
//
//let first = "irate"; // best average words left with all words
//let first = "aloes"; // best worst-case with all words
let first;

let topScore = -10000;

export function getFirstWord() {
  if (first) {
    return first; // cache
  }
  let trialSet = [];
  // Pick 500 words at random...
  let copy = words.slice();
  copy.sort((a, b) => Math.random() * 2 - 1);
  trialSet = copy.slice(0, 100);
  let smallest = 10000;
  let bestWord = "";
  let i = 0;
  let data = [];
  for (let word of allwords) {
    if (!word.match(/.*[bjkyxzwqv].*/i)) {
      i += 1;
      if (i % 100 == 0) {
        console.log("On word", i, word);
      }
      let worstSize = 0;
      let remainingSize = 0;
      for (let target of trialSet) {
        let guesses = [word];
        let results = [checkWordle(word, target)];
        let nresults = getPossibleWords(allwords, guesses, results).length;
        remainingSize += nresults;
        if (nresults > worstSize) {
          worstSize = nresults;
        }
      }
      data.push([word, remainingSize / trialSet.length, worstSize]);
      //remainingSize = remainingSize / trialSet.length;
      remainingSize = worstSize;
      if (remainingSize < smallest) {
        bestWord = word;
        smallest = remainingSize;
        console.log(
          "New best first word: ",
          bestWord,
          smallest,
          "worst case words left" //"average words left"
        );
      } else if (remainingSize == smallest) {
        console.log("Equally best word ", word, smallest);
      }
    }
  }
  console.log("Trail set:");
  console.log(trialSet);
  console.log("All computed data:");
  data.sort((a, b) => b[2] - a[2]);
  console.log("ALL DATA: ", data);
  debugger;
  first = bestWord;
  return first;
}

export function fancySolve(target) {
  let guesses = [];
  let results = [];
  let remaining = [];
  let remainingWordList = [["all..."]];
  /*let metadata = buildMetadata(words); //buildMetadata(allwords);
  let scoredWords = scoreWords(
    //words,
    allwords,
    metadata
  );*/
  let firstGuess = getFirstWord(); // scoredWords[0].word;
  guesses.push(firstGuess);
  results.push(checkWordle(firstGuess, target));
  let remainingWords = getPossibleWords(allwords, guesses, results);
  remaining.push(remainingWords.length);
  while (remainingWords.length > 1 && guesses.length < 100) {
    let guess = getNextGuess(guesses, results, remainingWords);
    guesses.push(guess);
    results.push(checkWordle(guess, target));
    remainingWords = getPossibleWords(
      //words,
      allwords,
      guesses,
      results
    );
    remaining.push(remainingWords.length);
    remainingWordList.push(remainingWords.slice(0, 20));
  }
  if (remainingWords.length == 1 && remainingWords[0] == target) {
    if (guesses.indexOf(target) == -1) {
      guesses.push(target);
    }
  } else {
    console.log("FAILED SOLVE");
    console.log({
      target,
      guesses,
      results,
      remaining,
      remainingWords,
    });
  }
  return {
    target,
    guesses,
    results,
    remaining,
    remainingWordList,
    remainingWords,
  };
}

/**
 * Pick the best next guess based on current wordle game.
 * "Best" guess means the one that is the most likely to give us
 * useful information.
 */

function getNextGuess(guesses, results, remainingWords) {
  if (remainingWords.length <= 2) {
    return remainingWords[0];
  }
  wordScoresDebug = {};
  let metadata = buildMetadata(remainingWords);
  let infoSoFar = getInfoFromResults(guesses, results);
  let best = { score: -1000000, word: "" };
  let contenders = [];
  for (let word of allwords) {
    let score = scoreWordForInformation(word, infoSoFar, metadata);
    /*if (remainingWords.indexOf(word) > -1) {
      // Some advantage to guessing words that might be right...
      score += 1;
    }*/
    if (score > best.score) {
      best = { word, score };
      contenders.push(best);
    }
  }
  console.log({
    contenders,
    guesses,
    results,
    remainingWords,
  });

  console.log(wordScoresDebug);
  console.log("Score was: ", best.word, wordScoresDebug[best.word]);
  console.log("Contenders were:");
  for (let c of contenders) {
    console.log(c.word, wordScoresDebug[c.word]);
  }
  return best.word;
}

let wordScoresDebug = {};
function scoreWordForInformation(
  word: string,
  infoSoFar: GuessInfo,
  metadata: Metadata
) {
  wordScoresDebug[word] = {};
  let ltrCounts = {};
  let score = 0;
  // First, pass through the word looking for likely useful
  // information for each letter in each slot
  // We'll also count letters while we're here...
  for (let i = 0; i < word.length; i++) {
    let ltr = word[i];
    if (infoSoFar.slots[i].length == 1) {
      // We already know what's here...
      if (ltr == infoSoFar.slots[i][0]) {
        score -= 10; // useless to guess right - no new information
      }
    } else {
      // We don't know what's here -- let's try to guess!
      if (metadata[i][ltr] > 50) {
        score += 100 - metadata[i][ltr]; // useful to guess right...
      } else {
        score += metadata[i][ltr]; // useful to guess right...
      }
    }
    // Count up letter...
    if (!ltrCounts[ltr]) {
      ltrCounts[ltr] = 1;
    } else {
      ltrCounts[ltr] += 1;
    }
  }
  wordScoresDebug[word].perLetterScore = score;
  // Ok, second pass... lets look at the letters in our word
  // and see how useful they are...
  for (let ltr in ltrCounts) {
    let count = ltrCounts[ltr];
    if (!infoSoFar.cantHave[ltr] && !infoSoFar.mustHave[ltr]) {
      // If we know nothing about this letter.
      score += 10 * metadata.anywhere[ltr];
    } else if (
      !infoSoFar.mustHave[ltr] < ltrCounts[ltr] &&
      (!infoSoFar.cantHave[ltr] || infoSoFar.cantHave[ltr] > ltrCounts[ltr])
    ) {
      // maybe half as useful to guess a letter twice?
      score += metadata.anywhere[ltr] / 2;
    }
  }
  wordScoresDebug[word].finalScore = score;
  return score;
}

export function fancyHardSolve(target) {
  // This is what I consider the lamest algorithm...
  // we just look for the highest frequency letters
  // in each position and guess the word that hits them...
  let guesses = [];
  let results = [];
  let remaining = [];
  let remainingWordList = [];
  let wordlist = allwords;
  do {
    if (guesses.length > 0) {
      //console.log("Filtering:", wordlist);
      wordlist = getPossibleWords(wordlist, guesses, results);
      //console.log("After", guess, result, "we have", wordlist.length, wordlist);
      if (wordlist.length == 0) {
        console.log("FAIL!");
        console.log("No words left after", guesses);
        return { guesses, results, remaining, wordlist, remainingWordList };
      }
    }
    remaining.push(wordlist.length);
    remainingWordList.push(wordlist.slice());
    let metadata;
    var guess;
    if (!guesses.length) {
      guess = "crane";
    } else {
      metadata = buildMetadata(wordlist);
      let infoSoFar = getInfoFromResults(guesses, results);
      wordlist = wordlist.filter((w) => guesses.indexOf(w) == -1);
      let scoredWords = scoreWords(wordlist, metadata, infoSoFar);
      guess = scoredWords[0].word;
    }
    //console.log("Picked guess", guess, "from options", scoredWords);
    guesses.push(guess);
    var result = checkWordle(guess, target);
    //console.log("Got result", result);
    results.push(result);
  } while (target != guess && guesses.length < 100);
  return { guesses, results, remaining, wordlist, remainingWordList };
}

function scoreWords(wordlist, metadata, infoSoFar) {
  let scoredWords = wordlist.map((word) => ({
    word,
    score: scoreWordForInformation(word, infoSoFar, metadata),
  }));
  scoredWords.sort((a, b) => b.score - a.score);
  return scoredWords;
}

function scoreWordForInformationBestSoFar(
  word: string,
  infoSoFar: GuessInfo,
  metadata: Metadata
) {
  let score = 0;
  let ltrCounts = {};

  let unknownLetters = {};
  for (let si = 0; si < infoSoFar.slots.length; si++) {
    let slot = infoSoFar.slots[si];
    if (slot.length > 1) {
      for (let ltr of slot) {
        let letterScore = metadata[si][ltr];
        if (letterScore > 50) {
          letterScore = 100 - letterScore;
        }
        if (!infoSoFar.mustHave[ltr]) {
          unknownLetters[ltr] = letterScore; //metadata[si][ltr];
        } else {
          unknownLetters[ltr] += letterScore; // metadata[si][ltr];
        }
      }
    }
  }
  for (let idx = 0; idx < word.length; idx++) {
    let ltr = word[idx];
    if (!ltrCounts[ltr]) {
      ltrCounts[ltr] = 1;
    } else {
      ltrCounts[ltr] += 1;
    }
    // Does it give us information about this slot... ?
    if (infoSoFar.slots[idx].indexOf(ltr) > -1) {
      if (infoSoFar.slots[idx].length > 1) {
        if (infoSoFar.mustHave[ltr]) {
          // Right letter new slot -- sure find out!
          // Score us based on our
          // Was 5x
          score += 5 * metadata[idx][ltr];
        } else {
          // New letter, unknown area...
          score += unknownLetters[ltr]; // metadata[idx][ltr];
        }
      } else {
        // already known...
        score -= 50;
      }
    }
    if (unknownLetters[ltr]) {
      if (ltrCounts[ltr] <= 1) {
        score += unknownLetters[ltr];
      } else {
      }
    } else {
      score -= 50; // letter we know isn't present...
    }
  }
  return score;
}

/*
this fails for 12 words... 
7: 12 (0.65%) 
		viper,eager,giver,famed,voter,piper,baker,waded,wiper,diver,kazoo,refer 
*/
function scoreWordForInformationPRETTYGOOD(
  word: string,
  infoSoFar: { slots: string[][]; mustHave; cantHave },
  metadata
) {
  let score = 0;
  let ltrCounts = {};

  /* let unknownLetters = {};
  for (let si = 0; si < infoSoFar.slots.length; si++) {
    let slot = infoSoFar.slots[si];
    if (slot.length > 1) {
      for (let ltr of slot) {
        let letterScore = metadata[si][ltr];
        if (letterScore > 50) {
          letterScore = 100 - letterScore;
        }
        if (!infoSoFar.mustHave[ltr]) {
          unknownLetters[ltr] = letterScore; //metadata[si][ltr];
        } else {
          unknownLetters[ltr] += letterScore; // metadata[si][ltr];
        }
      }
    }
  } */
  let unknownLetters = {};
  for (let idx = 0; idx < word.length; idx++) {
    let slotInfo = metadata[idx];
    for (let ltr in slotInfo) {
      if (slotInfo[ltr] > 0 && slotInfo[ltr] < 100) {
        let letterScore = slotInfo[ltr];
        if (letterScore > 50) {
          letterScore = 100 - letterScore;
        }
        if (!unknownLetters[ltr]) {
          unknownLetters[ltr] = 0;
        }
        unknownLetters[ltr] += letterScore;
      }
    }
  }

  for (let idx = 0; idx < word.length; idx++) {
    let ltr = word[idx];
    if (!ltrCounts[ltr]) {
      ltrCounts[ltr] = 1;
    } else {
      ltrCounts[ltr] += 1;
    }
    // Does it give us information about this slot... ?
    if (infoSoFar.slots[idx].indexOf(ltr) > -1) {
      if (infoSoFar.slots[idx].length > 1) {
        if (infoSoFar.mustHave[ltr]) {
          // Right letter new slot -- sure find out!
          // Score us based on our
          // Was 5x
          score += 2 * metadata[idx][ltr];
        } //else {
        // New letter, unknown area...
        // score += unknownLetters[ltr]; // metadata[idx][ltr];
        //}
      } else {
        // already known...
        score -= 50;
      }
    }
    if (unknownLetters[ltr] && ltrCounts[ltr] <= 1) {
      score += unknownLetters[ltr];
    } else {
      score -= 50; // letter we know isn't present...
    }
  }
  return score;
}
