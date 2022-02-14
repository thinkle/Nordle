import {wordSize, checkWordle} from '../wordle/';

function drawCanv (canvas : HTMLCanvasElement,
  guesses : string[],
  targets : string[]
) {
let sty = getComputedStyle(canvas);
  const GREEN = sty.getPropertyValue('--green');
  const YELLOW = sty.getPropertyValue('--yellow');
  const GREY = sty.getPropertyValue('--grey');  
  canvas.style.border = '1px solid var(--green)'
  // We go with 25x25 per square
  canvas.width = 5 + (targets.length * (1+wordSize) * 25) + (targets.length - 1 * 25);
  canvas.height = (targets.length + 4) * 25 + 50;
  let ratio = canvas.width / canvas.height;
  canvas.style.height = "calc(var(--height)/2)";
  canvas.style.width = `calc(var(--height)*${ratio}/2)`
  canvas.style.display = 'none';
  let ctx = canvas.getContext('2d');
  ctx.strokeStyle = GREY;
  let completed = [];
  for (let gi=0; gi<targets.length+5; gi++) {
    let guess = guesses[gi];
    let y = 5 + 25 * gi;
    for (let ti=0; ti<targets.length; ti++) {
      let x = 5 + (25 * (wordSize+1) * ti);
      let areWeDone = true;
      if (!guess || completed[ti]) {
        var result : String|String[] = 'eeeee'
      } else {
        result = checkWordle(guess,targets[ti]);
      }
      for (let i=0; i<result.length; i++) {
        if (result[i]=='🟩') {
          ctx.fillStyle = GREEN;
        } else if (result[i]=='🟨') {
          ctx.fillStyle = YELLOW;
          areWeDone = false;
        } else {
          ctx.fillStyle = GREY;
          areWeDone = false;
        }
        if (guess && !completed[ti]) {
          ctx.fillRect(
            x + i*25,
            y,
            20,
            20
          );
        }
        ctx.strokeRect(
          x + i*25,
          y,
          20,
          20
        );
      }
      if (areWeDone) {
        completed[ti] = true;
      }
    } 
  }
}

export function drawVictory (
  canvas : HTMLCanvasElement,
  guesses : string[],
  targets : string[]
) {
  drawCanv(canvas,guesses,targets);
  let img = document.createElement('img');
  document.querySelector('#draw').appendChild(
    img
  );
  img.src = canvas.toDataURL("image/png");
}
