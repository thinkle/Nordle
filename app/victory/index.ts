import "./style.css";
import { setupPlusOne } from "./plusOne";
import { guesses, targets, nth } from "../wordDisplay";
import { drawVictory } from "./draw";
import { wordleTextResult } from "./wordleText";
import { getGameInfo, getItemsForToday } from "../data/";
import { buildTodayStreak } from "./todaysStreak";
export function showVictory(correct, total) {
  let vdiv = document.querySelector("#victory");
  let gameInfo = getGameInfo(guesses, targets);
  vdiv.innerHTML = `
    <div class="center">      
      <div class="msg" style="font-weight:bold">      
        <a href="${
          window.location
        }">Nordle ${new Date().toLocaleDateString()} n=${nth}, ${
    gameInfo.number_solved
  }/${gameInfo.n}</a>
        <div class="today-streak">
        </div>
      <div id="draw"></div>
    </div> 
    
      <div class="bar">   
        <button class="ct">Copy</button>
        <button class="cp">Copy Img</button>    
        <button class="si">Save Img</button>    
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
  buildTodayStreak(vdiv.querySelector(".today-streak"), cb);
  let canvas = document.createElement("canvas");
  document.documentElement.appendChild(canvas);
  let canv = drawVictory(canvas, guesses, targets);
  setupPlusOne(vdiv, cb);
  vdiv.classList.add("active");

  let copyButton = vdiv.querySelector(".cp");
  let content = vdiv.querySelector(".msg");

  copyButton.addEventListener("click", function () {
    //let blob = new Blob([content.innerHTML], { type: "text/html" });

    canvas.toBlob(function (imageBlob) {
      navigator.clipboard.write([
        new ClipboardItem({
          [imageBlob.type]: imageBlob,
        }),
      ]);
    });
    //const item = new ClipboardItem({ "text/html": blob });
    //navigator.clipboard.write([item]);
  });

  let sb = vdiv.querySelector(".si");
  sb.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = `Nordle ${new Date().toLocaleDateString()}-${nth}.png`;
    link.href = canv.toDataURL();
    link.click();
  });

  let copyTextButton = vdiv.querySelector(".ct");
  navigator.clipboard.writeText(wordleTextResult(correct, total));
}
