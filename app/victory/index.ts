import "./style.css";
import { setupPlusOne } from "./plusOne";
import { guesses, targets, nth } from "../wordDisplay";
import { drawVictory } from "./draw";
import { wordleTextResult } from "./wordleText";
import { getGameInfo, getItemsForToday } from "../data/";
import { buildTodayStreak } from "./todaysStreak";
import { buildStreakForN } from "./streakForN";
export function showVictory(correct, total) {
  let vdiv = document.querySelector("#victory");
  let gameInfo = getGameInfo(guesses, targets);
  vdiv.innerHTML = `
    <div class="center">      
      <div class="msg" style="font-weight:bold">      
        <div style="display:flex;align-items:center;">
          <a href="${
            window.location
          }">Nordle ${new Date().toLocaleDateString()} n=${nth}, ${
    gameInfo.number_solved
  }/${gameInfo.n}</a>
          <div class="overall-streak"></div>
        </div>
        <div class="today-streak">
        </div>
        
      <div id="draw"></div>
      
    </div> 
    
      <div class="bar">   
        <button class="sh">Share</button>
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
  buildStreakForN(vdiv.querySelector(".overall-streak"));
  let canvas = document.createElement("canvas");
  document.documentElement.appendChild(canvas);
  let canv = drawVictory(canvas, guesses, targets);
  setupPlusOne(vdiv, cb);
  vdiv.classList.add("active");

  let copyButton = vdiv.querySelector(".cp");
  let content = vdiv.querySelector(".msg");

  copyButton.addEventListener("click", function () {
    canvas.toBlob(function (imageBlob) {
      navigator.clipboard.write([
        new ClipboardItem({
          [imageBlob.type]: imageBlob,
        }),
      ]);
    });
  });

  let shb = vdiv.querySelector("button.sh");
  shb.addEventListener("click", function () {
    canvas.toBlob(function (imageBlob) {
      let file = new File(
        [imageBlob],
        "NordleWin.png",
        //`Nordle ${new Date().toLocaleDateString()}-${nth}.png`,
        {
          type: imageBlob.type,
          lastModified: new Date().getTime(),
        }
      );
      let shareData = {
        //title: "Nordle results",
        //text: "Results",
        files: [file],
      };
      console.log("Share!", shareData, "with file", file);
      if (navigator.canShare && navigator.canShare(shareData)) {
        navigator
          .share(shareData)
          .then((r) => window.alert(`yes!!! ${r}`))
          .catch((e) => {
            console.log("ERROR!!!!");
            console.log(e);
          });
      } else {
        let newShareData = {
          title: `Nordle ${new Date().toLocaleDateString()}-${nth}.png`,
          url: `https://www.nordle.us?n=${nth}`,
          text: wordleTextResult(correct, total),
        };
        navigator.share(newShareData);
      }
    });
  });

  let sb = vdiv.querySelector(".si");
  sb.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = `Nordle ${new Date().toLocaleDateString()}-${nth}.png`;
    link.href = canv.toDataURL();
    link.click();
  });

  let copyTextButton = vdiv.querySelector(".ct");
  copyTextButton.addEventListener("click", function () {
    navigator.clipboard.writeText(wordleTextResult(correct, total));
  });
}
