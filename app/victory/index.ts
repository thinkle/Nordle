import "./style.css";
import { setupPlusOne } from "./plusOne";
import { guesses, targets, nth } from "../wordDisplay";
import { drawVictory } from "./draw";
import { wordleTextResult } from "./wordleText";
export function showVictory(correct, total) {
  let vdiv = document.querySelector("#victory");
  vdiv.innerHTML = `
    <div class="center">
      <div class="msg" style="font-weight:bold">      
        <a href="${
          window.location
        }">Nordle ${new Date().toLocaleDateString()} n=${nth}, ${correct}/${total}</a>
        
      <div id="draw"></div>
    </div> 
      <div class="bar">   
        <button class="ct">Copy</button>
        <button class="cp">Copy Img</button>        
        <span class="right">
          
          <button class="plusOne">n+1</button>
      </div>
      <button class="c">&times;</button>
    </div>
  `;
  let cb = vdiv.querySelector("button.c");
  cb.addEventListener("click", function () {
    vdiv.classList.remove("active");
  });
  let canvas = document.createElement("canvas");
  document.documentElement.appendChild(canvas);
  drawVictory(canvas, guesses, targets);
  setupPlusOne(vdiv, cb);
  vdiv.classList.add("active");

  let copyButton = vdiv.querySelector(".cp");
  let content = vdiv.querySelector(".msg");
  copyButton.addEventListener("click", function () {
    let blob = new Blob([content.innerHTML], { type: "text/html" });
    const item = new ClipboardItem({ "text/html": blob });
    navigator.clipboard.write([item]);
  });

  let copyTextButton = vdiv.querySelector(".ct");
  navigator.clipboard.writeText(wordleTextResult(correct, total));
}
