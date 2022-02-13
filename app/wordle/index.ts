export {checkWordle} from './validate';
export let wordSize = 5;
export {isWord,allWords} from './dictionary';
import {words} from './words';

let today = new Date()
let dateKey = today.getDate() * 30 + today.getFullYear() + today.getMonth() * 12;

console.log(today,'=>',dateKey);
let salt = 47;
export function getTargetWords (n) {
  let index = ((salt * n) + dateKey) % words.length;
  let list = [words[index]];
  for (let i=1; i<n; i++) {
    let idx = (index + i*(n*salt)) % words.length;
    list.push(words[idx])
  }
  return list;
}
