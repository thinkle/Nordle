import { getItemsForToday } from "../data/";
import type { GameInfo } from "../data/";
import { nInput } from "../settings";
export function buildTodayStreak(div: HTMLDivElement, closeButton) {
  div.innerHTML = "Today's Games: ";
  let todaysGames = getItemsForToday();

  if (todaysGames.length) {
    let maxn = todaysGames[todaysGames.length - 1].n;
    let playedByN = {};
    todaysGames.map((g) => (playedByN[g.n] = g));
    for (let i = 1; i < maxn + 1; i++) {
      let html = "";
      if (playedByN[i]) {
        html = makeCompleted(playedByN[i]);
      } else {
        html = `<button class="play">${i}</button>`;
      }
      let span = document.createElement("span");
      span.innerHTML = html;
      div.appendChild(span);
    }
  }
  for (let b of div.querySelectorAll("button.play")) {
    b.addEventListener("click", function (event) {
      nInput.value = event.target.innerText;
      var evt = document.createEvent("HTMLEvents");
      var event = new Event("change");
      // Dispatch it.
      nInput.dispatchEvent(event);
      closeButton.click();
    });
  }
}

function makeCompleted(gameInfo: GameInfo) {
  return `
  <button class="play 
    ${(gameInfo.success && "success") || "failure"}    
  ">
    ${gameInfo.n}</button>
  `;
}