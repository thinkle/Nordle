import { words } from "./wordle/words";
import { allWords, getTargetWords, setToday } from "./wordle";
import { targets } from "./wordDisplay/";
import { pushWord } from "./keyboard/";
import {getDateKey} from './wordle/';
const SHOW_KEYS = false;
const TEST_VICTORY = false;
const TEST_WORDGET = false;
const SHOW_POSSIBLE_WORDS = false;
const SHUFFLE_WORDS = true;


if (TEST_VICTORY) {
  pushWord("happy");
  pushWord("sadly");
  for (let w of targets) {
    pushWord(w);
  }
}
if (SHOW_KEYS) {
  let out = document.querySelector('#words');
  let txt;
  let today = new Date();
  for (let i=0; i<20; i++) {
    let day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDay()+i);
    let key = getDateKey(day);
    txt += `<br>${day} => ${key}`;
  }
  out.innerHTML = txt;
}
if (TEST_WORDGET) {
  let out = document.createElement("div");
  let txt = `
  <pre>
  `;
  for (let d = 1; d < 15; d++) {
    let date = new Date(2099, 1, d);
    setToday(date);
    txt += "\nNEW DAY:\n";
    for (let n = 1; n < 31; n++) {
      txt += getTargetWords(n) + "\n";
    }
  }
  out.innerHTML = txt + "</pre>";
  document.querySelector("main").style.display = "none";
  document.querySelector("body").appendChild(out);
}

// list 5-letter words not yet on our list
if (SHOW_POSSIBLE_WORDS) {
  let cont = document.querySelector("#words");
  let ul = document.createElement("pre");
  cont.appendChild(ul);
  ul.style.position = "fixed";
  ul.style.height = "100vh";
  ul.style.top = "0";
  ul.style.fontSize = "14pt";
  ul.style.backgroundColor = "black";
  ul.style.color = "green";
  ul.style.overflowY = "scroll";
  ul.style.width = "300px";
  ul.innerHTML = allWords
    .filter((w) => w.length == 5 && w[4] != "s" && words.indexOf(w) == -1)
    .map((w) => `'${w}',`)
    .join("\n");
}

// randomize current list...
if (SHUFFLE_WORDS) {
  let cont = document.querySelector("#words");
  let ul = document.createElement("pre");
  cont.appendChild(ul);
  ul.style.position = "fixed";
  ul.style.height = "100vh";
  ul.style.top = "0";
  ul.style.fontSize = "14pt";
  ul.style.backgroundColor = "black";
  ul.style.color = "green";
  ul.style.overflowY = "scroll";
  ul.style.width = "300px";
  ul.innerHTML = words
    .sort((a, b) => Math.random() * 2 - 1)
    .map((w) => `"${w}""`)
    .join(",\n  ");
}
