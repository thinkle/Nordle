import { words } from "./words";

export function setToday(d) {
  today = d;
}

let today = new Date();
export let dateKey =
  today.getDate() * 30 + today.getFullYear() + today.getMonth() * 12;

console.log(today, "=>", dateKey);
let salt = 54;
let salt2 = 117;
export function getTargetWords(n) {
  let dateKey =
    today.getDate() * 30 + today.getFullYear() + today.getMonth() * 12;
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
