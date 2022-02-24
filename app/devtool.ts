import { words } from "./wordle/words";
import { allWords, getTargetWords, setToday } from "./wordle";
import { targets } from "./wordDisplay/";
import { pushWord } from "./keyboard/";
import { getDateKey } from "./wordle/";
import { updateColumns, nInput } from "./settings";
import {
  buildMetadata,
  scoreWord,
  simpleSolve,
  getInfoFromGuess,
  testGetWords,
} from "./solver/";
import "./list_maker/";
const CHANGE_DAY = false;
const SHOW_KEYS = false;
const TEST_VICTORY = false;
const TEST_LOSS = false;
const TEST_WORDGET = true;
const SHOW_POSSIBLE_WORDS = false;
const SHUFFLE_WORDS = false;
const SOLVE_STUFF = false;

if (SOLVE_STUFF) {
  let metadata = buildMetadata(words);
  let out = "";
  if (true) {
    let guesses = ["fruit", "slate"];
    let wordlist = [
      "essay",
      "spray",
      "eagle",
      "assay",
      "floor",
      "flunk",
      "emcee",
      "smart",
    ];
    let target = "essay";
    out += `\nTest guessing: target ${target}, guesses: ${guesses}`;
    out += `\n:Original wordlist: ${wordlist}`;
    out += `\n:Filtered list: ${testGetWords(wordlist, guesses, target)}`;
  }
  if (true) {
    for (let guess of ["taken", "spout", "shoes", "fries", "spore"]) {
      out += `${guess},flout => ${JSON.stringify(
        getInfoFromGuess(guess, "flout"),
        null,
        4
      )}`;
    }
  }
  if (true) {
    out += "Solver solve:\n\n";
    let target = "sassy"; // WE HAVE A BUG ON THIS ONE -- 2 AND 3 S'S
    for (let i = 0; i < 133; i++) {
      out += `\nTarget : ${target}`;
      let results = simpleSolve(target);
      out += `\n${results.guesses.length} \n\t${
        results.guesses
      }\n\t${results.results.map((r) => r.join(""))}`;
      target = words[Math.floor(Math.random() * words.length)];
    }
    // You have a bug in this next one...
    // sores + sassy
  }
  if (true) {
    for (let k in metadata) {
      out += `\n${k}:`;
      for (let ltr in metadata[k]) {
        out += `\n\t${ltr}: ${metadata[k][ltr].toFixed(2)}%`;
      }
    }

    let scoredWords = allWords.map((word) => ({
      word,
      score: scoreWord(word, metadata),
    }));
    scoredWords.sort((a, b) => b.score - a.score);
    out += "\n\nWords sorted by score:";
    for (let sw of scoredWords) {
      out += `\n\t${sw.word}: ${sw.score.toFixed(1)}`;
    }
  }
  document.querySelector("html").innerHTML = `<pre>${out}</pre>`;
}
if (CHANGE_DAY) {
  setToday(new Date(2099, 2, 2));
  updateColumns();
}
if (TEST_LOSS) {
  setToday(new Date(2099, 2, 3));
  updateColumns();
  let n = nInput.valueAsNumber;
  /* n + 5 is the full number -- this is set up
  so I can type in one by hand and watch the animation
  or whatever */
  for (let i = 0; i < n + 4; i++) {
    pushWord(words[i]);
  }
}
if (TEST_VICTORY) {
  setToday(new Date(2099, 2, 2));
  updateColumns();
  pushWord("happy");
  pushWord("sadly");
  for (let w of targets) {
    pushWord(w);
  }
}
if (SHOW_KEYS) {
  let out = document.querySelector("#words");
  let txt;
  let today = new Date();
  for (let i = 0; i < 20; i++) {
    let day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDay() + i
    );
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
  let wordappearances = {};
  for (let d = 1; d < 23; d++) {
    let date = new Date(2022, 1, d);
    setToday(date);
    txt += `\n${date} ${getDateKey(date)}\n`;
    for (let n = 1; n < 16; n++) {
      let targets = getTargetWords(n);
      txt += `${n}\t` + targets + "\n";
      targets.map((t) => {
        if (wordappearances[t]) {
          wordappearances[t].push(date);
        } else {
          wordappearances[t] = [date];
        }
      });
    }
  }
  txt += `\n\n${Object.keys(wordappearances).length}`;
  let wordsUsed = 0;
  let uses = 0;
  let maxrepeats = 0;
  for (let k in wordappearances) {
    wordsUsed += 1;
    uses += wordappearances[k].length;
    if (wordappearances[k].length > maxrepeats) {
      maxrepeats = wordappearances[k].length;
    }
  }
  txt += `\n${wordsUsed} used, on average ${uses / wordsUsed} times`;
  txt += `\nMax repeats: ${maxrepeats}`;
  txt += `\n${wordappearances}`;
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
