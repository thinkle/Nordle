import "./style.css";
import "./a11y.css";
import { makeColumn } from "./column";
import { Column } from "./column";
import { isWord, getTargetWords, wordSize } from "../wordle";
import { allowNoMoreChanges } from "../settings";
import {
  onWordChange,
  onWordCommit,
  setKeyBackground,
  resetKeyboard,
} from "../keyboard";

import { getWords, saveWords, storeGame, loadGame } from "../data/";

export let gameOver = false;
let wordsDiv = document.querySelector("#words");
let columns: Column[] = [];
export let guesses: String[] = [];
export let targets: String[] = [];
export let nth;
export let nguesses;

let onFinishCallback = (w: number, n: number) => window.alert("Wow, go you!");

export function onFinish(f: (wins, n) => void) {
  onFinishCallback = f;
}

function commitColumnsAndKeyboard(word, noninteractive = false) {
  let delay = 2500;
  if (noninteractive) {
    delay = 0;
  }
  columns.forEach((c) => {
    if (noninteractive) {
      c.currentRow.classList.add("no-animate");
    }
    c.onCommit(word);
  });

  let active = columns.find((c) => !c.complete);
  if (active) {
    if (guesses.length < nguesses) {
      window.setTimeout(function () {
        for (let ltr in active.letters) {
          let bg = makeGradient(ltr);
          setKeyBackground(ltr, bg);
        }
      }, delay);
    } else {
      gameOver = true;
      let complete = 0;
      columns.forEach((c) => {
        if (c.complete) {
          complete += 1;
        }
      });
      if (complete < nth) {
        delay *= 2;
      }
      window.setTimeout(function () {
        resetKeyboard();
        for (let c of columns) {
          c.col.classList.remove("complete");
        }
        if (!noninteractive) {
          onFinishCallback(complete, nth);
        }
      }, delay);
    }
  } else {
    gameOver = true;
    window.setTimeout(function () {
      resetKeyboard();
      for (let c of columns) {
        c.col.classList.remove("complete");
      }
      //if (!noninteractive) {
      onFinishCallback(nth, nth);
      //}
    }, delay);
  }
}

let commitWord = (word: String) => {
  if (!isWord(word) || word.length != wordSize) {
    columns.forEach((c) => c.indicateBadWord());
    return true;
  } else {
    allowNoMoreChanges();
    guesses.push(word);
    saveWords(nth, guesses);
    storeGame(guesses, targets);
    commitColumnsAndKeyboard(word);
    return false;
  }
};
onWordCommit(commitWord);
onWordChange((word: String) => columns.forEach((c) => c.onChange(word)));

/* 
function flipWord(w) {
  let newWord = "";
  for (let i = w.length - 1; i > -1; i--) {
    newWord += w[i];
  }
  return newWord;
} */

export function makeColumns(n: number, limit: number): void {
  resetKeyboard();
  let reverseMode = false;
  nth = Math.abs(n);
  if (n < 0) {
    reverseMode = true;
  }
  wordsDiv.innerHTML = ""; // empty
  columns = [];
  let savedInfo = loadGame({ n: nth });
  guesses = savedInfo?.guesses || getWords(nth);
  // Fix bad guesses we saved by
  // accident :-\
  guesses = guesses.filter((w) => w.length == wordSize && isWord(w));
  targets = [];
  nguesses = limit;
  gameOver = false;
  let targetWords = savedInfo?.targets || getTargetWords(nth);
  for (let i = 0; i < nth; i++) {
    let column = makeColumn(limit);
    column.target = targetWords[i];
    column.col.setAttribute("aria-label", `Word ${i + 1}`);
    column.col.setAttribute("role", "list");
    if (reverseMode) {
      column.col.classList.add("reverse");
    }
    targets.push(targetWords[i]);
    wordsDiv.appendChild(column.col);
    columns.push(column);
  }
  wordsDiv.style.setProperty("--n", `${nth}`);
  wordsDiv.style.setProperty("--limit", `${limit}`);
  for (let g of guesses) {
    commitColumnsAndKeyboard(g, true);
  }
}

function makeGradient(ltr) {
  let bg = "linear-gradient(90deg ";
  let activeColumns = columns.filter((c) => !c.complete);
  let start = "0";
  for (let i = 0; i < activeColumns.length; i++) {
    let color = activeColumns[i].letters[ltr];
    let endn = (100 / activeColumns.length) * (i + 1);
    let end = `${endn}%`;
    bg = `${bg}, ${color} ${start} ${end}`;
    start = end;
  }
  bg = bg + ")";
  return bg;
}
