import { wordSize, checkWordle } from "../wordle/";
import { getItemsForToday } from "../data/";
import type { GameInfo } from "../data/";

function drawCanv(
  canvas: HTMLCanvasElement,
  guesses: string[],
  targets: string[]
) {
  let sty = getComputedStyle(canvas);
  const GREEN = sty.getPropertyValue("--green");
  const YELLOW = sty.getPropertyValue("--yellow");
  const GREY = sty.getPropertyValue("--grey");
  canvas.style.border = "1px solid var(--green)";
  // We go with 25x25 per square
  let SW = 100;
  let ctx = canvas.getContext("2d");

  setupCanvasSize();
  drawSquares();
  drawDailyStreak();
  drawOverlay();

  function drawOverlay() {
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffffdd";
    ctx.strokeStyle = "#111d";
    ctx.font = "42pt InputBetaSerifMono";
    ctx.fillText(`n=${targets.length}`, canvas.width / 2, canvas.height / 2);
    ctx.strokeText(`n=${targets.length}`, canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "right";
    ctx.font = "16pt InputBetaSerifMono";
    ctx.fillStyle = "#111d3";
    ctx.fillText("nordle.us", canvas.width, canvas.height - 18);
    ctx.fill();
  }

  function setupCanvasSize() {
    if (targets.length < 10) {
      SW = 50;
    } else {
      SW = 1920 / (5 * targets.length);
    }
    if (SW < 1) {
      SW = 1;
    }
    canvas.width =
      5 + targets.length * (1 + wordSize) * SW + (targets.length - 1 * SW);
    canvas.height = SW * 4 + (targets.length + 4) * SW + SW * 2;
    let ratio = canvas.width / canvas.height;
    //canvas.style.height = `${canvas.height}px`; //"calc(var(--height)/2)";
    //canvas.style.width = `${canvas.width}px`; // `calc(var(--height)*${ratio}/2)`;
    canvas.style.display = "none";
  }

  function drawDailyStreak() {
    let todaysGames = getItemsForToday();
    let maxn = targets.length; //todaysGames[todaysGames.length - 1].n;
    let colWidth = Math.min(SW * 2, (canvas.width * 0.8) / maxn);
    let PAD = SW;
    if (todaysGames.length) {
      let playedByN = {};
      todaysGames.map((g) => (playedByN[g.n] = g));
      for (let i = 1; i < maxn + 1; i++) {
        let gi: GameInfo | null = playedByN[i];
        if (gi && gi.success) {
          ctx.fillStyle = GREEN;
        } else if (gi) {
          ctx.fillStyle = YELLOW;
        } else {
          ctx.fillStyle = "white";
        }
        let x = (PAD + colWidth) * (i - 1);
        let y = PAD;
        ctx.font = `${SW * 0.8}px InputBetaSerifMono, InputSerif, Mono, Serif`;
        ctx.beginPath();
        let subwidth = colWidth / i;
        let subpad = (i > 1 && SW / 10) || 0;
        subwidth -= subpad;
        let heights = [];
        for (let h = 1; h <= i; h++) {
          heights.push(h);
        }
        if (gi) {
          heights.sort((a, b) => Math.random() * 2 - 1);
          for (let subrect = 0; subrect < i; subrect++) {
            //ctx.fillRect(x, y, colWidth, SW * 2);
            if (gi.number_solved <= subrect) {
              ctx.fillStyle = YELLOW;
            } else {
              ctx.fillStyle = GREEN;
            }
            ctx.fillRect(
              x + subrect * (subwidth + subpad),
              y,
              subwidth,
              (SW * 2 * heights[subrect]) / i
            );
          }
        }
        let oldLineWidth = ctx.lineWidth;
        ctx.lineWidth = SW / 3;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.fillStyle = "#222";
        ctx.strokeText(`${i}`, x + colWidth / 3, y + SW * 1.3, colWidth);
        ctx.fillText(`${i}`, x + colWidth / 3, y + SW * 1.3, colWidth);
        ctx.stroke();
        ctx.fill();
        ctx.lineWidth = oldLineWidth;
      }
    }
  }

  function drawSquares() {
    ctx.strokeStyle = GREY;
    ctx.lineWidth = SW / 20;
    ctx.lineJoin = "round";
    let completed = [];
    for (let gi = 0; gi < targets.length + 5; gi++) {
      let guess = guesses[gi];
      let y = SW * 4 + 5 + SW * gi;
      for (let ti = 0; ti < targets.length; ti++) {
        let x = 5 + SW * (wordSize + 1) * ti;
        let areWeDone = true;
        if (!guess || completed[ti]) {
          var result: String | String[] = "eeeee";
        } else {
          result = checkWordle(guess, targets[ti]);
        }
        for (let i = 0; i < result.length; i++) {
          if (result[i] == "🟩") {
            ctx.fillStyle = GREEN;
          } else if (result[i] == "🟨") {
            ctx.fillStyle = YELLOW;
            areWeDone = false;
          } else {
            ctx.fillStyle = GREY;
            areWeDone = false;
          }
          if (guess && !completed[ti]) {
            ctx.fillRect(x + i * SW, y, SW * 0.8, SW * 0.8);
          }
          ctx.strokeRect(x + i * SW, y, SW * 0.8, SW * 0.8);
        }
        if (areWeDone) {
          completed[ti] = true;
        }
      }
    }
  }
}

export function drawVictory(
  canvas: HTMLCanvasElement,
  guesses: string[],
  targets: string[]
) {
  drawCanv(canvas, guesses, targets);
  let img = document.createElement("img");
  document.querySelector("#draw").appendChild(img);
  img.src = canvas.toDataURL("image/png");
  return canvas;
}
