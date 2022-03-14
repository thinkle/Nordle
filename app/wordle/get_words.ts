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

let salt = 54;
let salt2 = 117;

export function getTargetWordsNEW(n) {
  // 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18...
  // Day 1: 1: 1...     (start = 1)
  //        2: 2, 3     (spacing = 1)
  //        3: 4, 5, 6
  //
  // Day 2:    (start = 200, spacing = 2)
  //       1: 200
  //       2: 202, 204
  //       3: 206, 208, 210
  //       4: 212, 214, 218, 218
  // Day 7:
  //       1: 700
  //       2: 707, 714
  //       3: 721, 728, 735
  // Day 100:
  //       1: 1...
  //       2: 101, 201
  //       3: 301, 401, 501,
  //       4: 601, 701, 801, 901...
  // Day 101:
  //       1: 501
  //       2: 602, 703
  //       3: 804, 905, 1006
  dateKey = getDateKey(today);
  let skipSize = dateKey % 100; /* here be magic? */
  let startIndex = dateKey * 300; /* here be more magic! */
  let firstWord = getStart(n);
  let mywords = [];
  for (let i = 0; i < n; i++) {
    let index = firstWord + i;
    let wordIndex = startIndex + index * skipSize;
    //mywords.push(words[wordIndex % words.length]);
    mywords.push(wordIndex % words.length);
  }
  return mywords;
}

function getStart(n: number) {
  let total = 0;
  for (let nn = 0; nn < n; nn++) {
    for (let i = 0; i < nn; i++) {
      total += 1;
    }
  }
  return total;
}

export function getTargetWords(n) {
  if (n >= words.length) {
    words.sort((a, b) => Math.random() - 2);
    return words;
  }
  dateKey = getDateKey(today);
  let index = (salt2 * n + dateKey) % words.length;
  let list = [words[index]];
  for (let i = 1; i < n; i++) {
    let idx = (index + i * (n * (salt + dateKey))) % words.length;
    let word = words[idx];
    if (list.indexOf(word) > -1) {
      // duplicate!
      list.push(getAdjacentWord(list, idx, words));
    } else {
      list.push(words[idx]);
    }
  }
  return list;
}
function getAdjacentWord(currentList, idx, words) {
  for (let i = 1; i < words.length; i++) {
    let newIndex = idx + (i % words.length);
    if (currentList.indexOf(words[newIndex]) == -1) {
      return words[newIndex];
    }
  }
  console.log("getAdjacent failure :(");
  return "fails";
}
