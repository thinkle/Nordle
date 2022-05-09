import { getStreak } from "../data/streaks";
import type { GameInfo } from "../data/";
import { nInput } from "../settings";
import { button } from "../info/button";
import { getDateFromKey } from "../wordle/get_words";

export function buildStreakForN(div: HTMLDivElement) {
  div.classList.add("n-streak");
  let n = nInput.valueAsNumber;
  let streakInfo = getStreak(n);
  div.innerHTML = `<button class="streak-button"></button>`;
  let button = div.querySelector("button");
  if (streakInfo.currentStreak == 0) {
    button.innerText = "0🔥 :(";
  } else {
    button.innerText = `${streakInfo.currentStreak}🔥`;
  }
  let streakInfoDiv = document.createElement("div");
  streakInfoDiv.classList.add("hide");
  button.addEventListener("click", () => {
    streakInfoDiv.classList.toggle("hide");
    streakInfoDiv.classList.toggle("show");
    div.classList.toggle("streak-popout");
  });

  let longestInfo = "";
  if (streakInfo.longestStreak) {
    let dateInfo = "";
    // We might have some old date keys from before we simplified sitting in
    // local storage which would read as dates far in the future... so we'll check
    // if the date of our longest streak is actually in the past before displaying
    // it :)
    if (
      getDateFromKey(streakInfo.longestStreakStart).getTime() <
      new Date().getTime()
    ) {
      dateInfo = `
      <tr>
        <td></td>
        <td>From ${getDateFromKey(
          streakInfo.longestStreakStart
        ).toLocaleDateString()}
          to ${getDateFromKey(
            streakInfo.longestStreakStart + streakInfo.longestStreak - 1
          ).toLocaleDateString()}
      `;
    }

    longestInfo = `    
    <tr>
      <td rowspan="2">Longest Streak</td>
      <td>${streakInfo.longestStreak}</td>
    </tr>   
    ${dateInfo}
    `;
  }
  streakInfoDiv.innerHTML = `
    <table>
      <tr>
        <td colspan="2">Streak for n=${n}</td>
      </tr>
      <tr>
        <td>Current Streak</td>
        <td>${streakInfo.currentStreak}</td>        
      </tr>
      ${longestInfo}   
      <tr>
        <td>Wins</td>
        <td>${streakInfo.solved}/${streakInfo.attempted}</td>
      </tr>
      <tr>
        <td>Words solved</td>
        <td>${streakInfo.wordsSolved}/${
    streakInfo.attempted * streakInfo.n
  }</td>
      </tr>
    </table>
  `;
  div.appendChild(streakInfoDiv);
}

function makeCompleted(gameInfo: GameInfo) {
  return `
  <span class="mini-summary-box ${
    (gameInfo.success && "success") || "failure"
  }"  >
  <button class="play 
     
  ">
    ${gameInfo.n}</button>
    <span class="icon">
    ${(gameInfo.success && "✓") || "×"}
    </span></span>
  `;
}
