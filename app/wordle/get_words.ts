import {words} from './words';

let today = new Date()
let dateKey = today.getDate() * 30 + today.getFullYear() + today.getMonth() * 12;

console.log(today,'=>',dateKey);
let salt = 54;
let salt2 = 17;
export function getTargetWords (n) {
  let index = ((salt2 * n) + dateKey) % words.length;
  let list = [words[index]];
  for (let i=1; i<n; i++) {
    let idx = (index + i*(n*salt)) % words.length;
    while (list.indexOf(words[idx]) > -1) {
      idx += 1;
    }
    list.push(words[idx])
  }
  return list;
}