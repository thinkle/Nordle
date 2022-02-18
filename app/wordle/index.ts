export {checkWordle} from './validate';
export let wordSize = 5;
export {isWord,allWords} from './dictionary';
import {words} from './words';
export {getTargetWords, setToday} from './get_words';
export {a11ySquares} from './a11y'

for (let w of words) {
  allWords.push(w);
}
