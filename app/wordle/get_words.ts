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
  return d;
}

let today = new Date();
export let dateKey = getDateKey(today);

let salt = 54;
let salt2 = 117;
export function getTargetWords(n) {
  dateKey = getDateKey(today);
  let index = (salt2 * n + dateKey) % words.length;
  let list = [words[index]];
  for (let i = 1; i < n; i++) {
    let idx = (index + i * (n * salt)) % words.length;
    while (list.indexOf(words[idx]) > -1) {
      idx += 1;
    }
    list.push(words[idx]);
  }
  return list;
}
