import a11yURL from "../a11y.png";

import { makeColumns } from "./wordDisplay";
export let nInput: HTMLInputElement = document.querySelector("#n");
let nDisplay: HTMLSpanElement = document.querySelector("#ndisplay");
nInput.insertAdjacentHTML(
  "afterend",
  `<button aria-label="Add another word" class="nb nup">▲</button>
  <button aria-label="Remove a word" class="nb ndown">▼</button>
  `
);

document.querySelector(".nup").addEventListener("click", function () {
  nInput.valueAsNumber += 1;
  updateColumns();
});

document.querySelector(".ndown").addEventListener("click", function () {
  nInput.valueAsNumber -= 1;
  updateColumns();
});

export function updateColumns() {
  let v = nInput.valueAsNumber;
  if (v) {
    let guesses = 5 + Math.abs(v);
    window.history.replaceState(null, "Nordle", "?n=" + v);
    //location.search = '?n='+v;
    makeColumns(v, guesses);
  }
}

nInput.addEventListener("change", updateColumns);

if (location.search) {
  if (location.search.indexOf("?n=") == 0) {
    let n = Number(location.search.substr(3));
    if (n) {
      nInput.valueAsNumber = n;
    }
  }
}
updateColumns();
let editMode = true;

export function allowChanges() {
  nInput.style.display = "initial";
  nDisplay.style.display = "none";
  for (let w of document.querySelectorAll(".nb")) {
    w.style.display = "initial";
  }
  editMode = true;
}

export function allowNoMoreChanges() {
  if (editMode) {
    nInput.style.display = "none";
    nDisplay.style.display = "initial";
    for (let w of document.querySelectorAll(".nb")) {
      w.style.display = "none";
    }
    nDisplay.innerText = nInput.value;
    editMode = false;
  }
}

document.querySelector("#a11y img").src = a11yURL;

document.querySelector("#a11y").addEventListener("click", (event) => {
  document.querySelector("form").classList.toggle("active");
  document.querySelector("#words").classList.toggle("a11y");
  document.querySelector("form input").focus();
});
