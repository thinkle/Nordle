export { checkWordle, checkGuesses } from "./validate";
export { wordSize } from "./constants";
import { isWord, allWords } from "./dictionary";
import { words } from "./words";
export { getTargetWords, setToday, getDateKey } from "./get_words";
export { a11ySquares } from "./a11y";
for (let w of words) {
  allWords.push(w);
}
export { allWords, isWord };
export let CORRECT = "🟩";
export let PRESENT = "🟨";
export let WRONG = "⬛";
