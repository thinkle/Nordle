import { words } from "./words";

export function setToday(d) {
  today = d;
}

export function getDateKey(date) {
  //return date.getDate() * 30 + date.getFullYear() + date.getMonth() * 12
  let baseDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  let baseTime = new Date(2022, 0, 1);
  let ms = baseDay - baseTime.getTime();
  let s = ms / 1000;
  let m = s / 60;
  let h = m / 60;
  let d = h / 24;
  return Math.floor(d) + 1;
}

let today = new Date();
export let dateKey = getDateKey(today);

let sortCache = {};

let initialSortFunctions = [
  //(l) => l.reverse(),
  (l) => l,
  (l) => l.sort((a, b) => scrabbleScore(a) - scrabbleScore(b)),
];

function scrabbleScore(w) {
  const scrab = {
    a: 1,
    b: 3,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 1,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10,
  };
  let score = 0;
  for (let l of w) {
    score += scrab[l] || 0;
  }
  return score;
}

function makeSorterForLetter(i) {
  return function (lst) {
    lst.sort((a, b) => {
      if (a[i] > b[i]) {
        return 1;
      } else if (a[i] < b[i]) {
        return -1;
      } else {
        return 0;
      }
    });
  };
}

for (let i = 0; i < 5; i++) {
  initialSortFunctions.push(makeSorterForLetter(i));
}

function sortWordsForDate(n) {
  if (sortCache[n]) {
    return sortCache[n];
  }
  // swap every word with the word n from it...
  let alreadySwapped = {};
  let mywords = words.slice();
  let initialSorter = initialSortFunctions[n % initialSortFunctions.length];
  initialSorter(mywords);
  let swapWith = n;
  for (let i = 0; i < mywords.length; i++) {
    let current = i;
    let target = (i + swapWith) % words.length;
    if (!alreadySwapped[current]) {
      let temp = mywords[i];
      mywords[i] = mywords[target];
      mywords[target] = temp;
      alreadySwapped[target] = true;
      alreadySwapped[i] = true;
      // Move one further out...
      swapWith += 1;
    }
  }
  sortCache[n] = mywords;
  return mywords;
}

export function getTargetWords(n) {
  let dateKey = getDateKey(today);
  let mywords = sortWordsForDate(dateKey);
  let offset = 0;
  for (let i = 1; i < n; i++) {
    offset += i;
  }
  let list = [];
  for (let idx = offset; idx < offset + n; idx++) {
    list.push(mywords[idx % words.length]);
  }
  return list;
}
