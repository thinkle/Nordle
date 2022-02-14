import {nguesses,guesses,targets,nth} from '../wordDisplay';
import {wordSize, checkWordle} from '../wordle/';

export function wordleTextResult (correct, total) {
  let header = `Nordle ${new Date().toLocaleDateString()} n=${nth} ${correct}/${total}\n`
  let footer = window.location;
  let completedTargets = [];
  let outText = ''
  let victory = '';
  let empty = '';
  for (let i=0; i<wordSize; i++) {
    victory += '🟩';
    empty += '⬜'
  }
  for (let gi=0; gi<nguesses; gi++) {
    let g = guesses[gi];
    let resultStrings = [];
    for (let ti=0; ti<targets.length; ti++) {
      let result;
      if (completedTargets[ti]) {
        result = empty;
      } else {
        let t = targets[ti];
        result = checkWordle(g,t).join('');
        if (result==victory) {
          completedTargets[ti] = true;
        }
      }
      resultStrings.push(result);
    }
    outText += resultStrings.join(' ') + '\n';    
  }
  return header + outText + footer;
}

`'🟩''⬛''🟨'⬜'`