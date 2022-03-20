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
  fancySolve,
  fancyHardSolve,
} from "./solver/";
import "./list_maker/";
const CHANGE_DAY = false;
const SHOW_KEYS = false;
const TEST_PARTIAL = false;
const TEST_VICTORY = false;
const TEST_LOSS = false;
const TEST_WORDGET = true;
const SHOW_POSSIBLE_WORDS = false;
const SHUFFLE_WORDS = false;
const SOLVE_STUFF = false;

if (SOLVE_STUFF) {
  let metadata = buildMetadata(words);
  let out = "";
  if (false) {
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
  if (false) {
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
    //let target = "airer"; // WE HAVE A BUG ON THIS ONE -- 2 AND 3 S'S
    let allResults = [];
    //for (let i = 0; i < 1000; i++) {

    for (let target of [
      /* "sweet",
      "viola",
      "kabob",
      "woman",
      "anime",
      "wiped",
      "vexed",
      "fight",
      "joker",
      "fixed",
      "foxed",
      "joked",
      "boxer",
      "vivid",
      "shoes",
      "bound",
      "tight",
      "viper",
      "eager",
      "giver",
      "famed",
      "voter",
      "piper",
      "baker",
      "waded",
      "wiper",
      "diver",
      "kazoo",
      "refer", */
      //...words,
      "month",
      "acrid",
      "pygmy",
      "above",
      "abuzz",
      "about",

      //...words.slice(0, 50),
    ]) {
      // words) {
      console.log("Solve", target);
      let results = fancySolve(target); //fancySolve(target);
      allResults.push({
        target,
        results,
      });
      /*
      if (results.wordlist) {
        var otherWords = results.wordlist.filter(
          (w) => !allResults.find((ar) => ar.target == w)
        );
      }
      if (otherWords.length) {
        target = otherWords[0];
      } else { */
      //target = words[Math.floor(Math.random() * words.length)];
      /* } */
    }
    allResults.sort(
      (a, b) => b.results.guesses.length - a.results.guesses.length
    );
    // metadata...
    let byGuesses = {};
    for (let r of allResults) {
      if (!byGuesses[r.results.guesses.length]) {
        byGuesses[r.results.guesses.length] = [];
      }
      byGuesses[r.results.guesses.length].push(r.target);
    }
    out += "BY # of GUESSES:";
    for (let n in byGuesses) {
      let number = byGuesses[n].length;
      let perc = (number * 100) / words.length;
      out += `\n\t${n}: ${number} (${perc.toFixed(2)}%) `;
      out += `\n\t\t${byGuesses[n].join(",")}`;
    }
    for (let { results, target } of allResults.slice(0, 50)) {
      out += `\nTarget : ${target} solved in ${results.guesses.length}`;
      if (results.guesses[results.guesses.length - 1] != target) {
        out += ` FAIL!!!! ran out on ${
          results.guesses[results.guesses.length - 1]
        }`;
      }
      //let results = simpleSolve(target);
      for (let i = 0; i < results.guesses.length; i++) {
        if (results.results[i]) {
          out += `\n\t${results.results[i].join("")} ${results.guesses[i]} => ${
            results.remaining[i]
          }`;
          if (results.remaining[i] < 30) {
            out += " " + results.remainingWordList[i];
          }
        } else {
          out += `\n\t🟩🟩🟩🟩🟩 ${results.guesses[i]} ${
            results.remaining[i] || 1
          }`;
        }
      }
      /*out += `\n${results.guesses.length} \n\t${
        results.guesses
      }\n\t${results.results.map((r, i) => `${r.join("")}`)}\n\t# of Words: ${
        results.remaining
      }`;
      try {
        var beforeLastGuess = results.remaining[results.guesses.length - 1];
      } catch (err) {
        console.log("wtf is up with ", results);
        beforeLastGuess = 999;
      }*/
      /*if (beforeLastGuess == 1) {
        out += `\n\tBefore last guess: 1   (Worst case: ${results.guesses.length})`;
      } else {
        out += `\n\tBefore last guess: ${beforeLastGuess} (Worst case: ${
          results.guesses.length + beforeLastGuess - 1
        })`;
      } */
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
if (TEST_PARTIAL) {
  setToday(new Date(2099, 2, 3));
  updateColumns();
  for (let w of targets.slice(0, 2)) {
    pushWord(w);
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
  for (let d = 1; d < 14; d++) {
    let date = new Date(2029, 6, d, 12);
    setToday(date);
    txt += `\n${date} ${getDateKey(date)}\n`;
    for (let n = 1; n < 10; n++) {
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
  let maxrepeated = [];
  for (let k in wordappearances) {
    wordsUsed += 1;
    uses += wordappearances[k].length;
    if (wordappearances[k].length > maxrepeats) {
      maxrepeats = wordappearances[k].length;
      maxrepeated = [k];
    } else if (wordappearances[k].length == maxrepeats) {
      maxrepeated.push(k);
    }
  }
  txt += `\n${wordsUsed} used, on average ${uses / wordsUsed} times`;
  txt += `\nMax repeats: ${maxrepeats} (${maxrepeated})`;
  txt += `\n${JSON.stringify(wordappearances)}`;
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
