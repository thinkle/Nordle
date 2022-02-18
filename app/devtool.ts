import { words } from "./wordle/words";
import { allWords, getTargetWords, setToday } from "./wordle";
if (false) {
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
if (true) {
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
if (false) {
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
  ul.innerHTML = alpha
    .sort((a, b) => Math.random() * 2 - 1)
    .map((w) => `'${w}'`)
    .join(",");
}
