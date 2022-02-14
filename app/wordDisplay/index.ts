import './style.css';
import  {makeColumn} from './column.ts';
import  {Column} from './column.ts';
import {isWord, getTargetWords} from '../wordle';
import {
  allowNoMoreChanges
} from '../settings';
import {
  onWordChange, 
  onWordCommit,
  setKeyBackground,
  resetKeyboard
} from '../keyboard';

export let gameOver = false;
let wordsDiv = document.querySelector('#words')
let columns : Column[] = [];
export let guesses : String[] = [];
export let targets : String[] = [];
export let nth;
let onVictoryCallback = ()=>window.alert('Wow, go you!');

export function onVictory (f : ()=>void) {
  onVictoryCallback = f;
}

onWordCommit(
  (word : String) => {
    if (!isWord(word)) {
      columns.forEach(
        (c)=>c.indicateBadWord()
      );
      return true;
    } else {      
      allowNoMoreChanges();
      guesses.push(word);
      columns.forEach(
        (c)=>c.onCommit(word)
      );   

      let active = columns.find((c)=>!c.complete);
      if (active) {
        window.setTimeout(
          function () {
            for (let ltr in active.letters) {
                    let bg = makeGradient(ltr);
                    setKeyBackground(ltr,bg);
            }
          },
          2000
        )   
      } else {
        gameOver = true;
        window.setTimeout(
          function () {
            resetKeyboard();
            for (let c of columns) {
              c.col.classList.remove('complete');
            }
            onVictoryCallback();
          },
          2500
        )        
      }      
      return false;
    }    
  }
);
onWordChange(
  (word : String) => columns.forEach(
    (c)=>c.onChange(word)
  )
)

export function makeColumns (n : number, limit : number) {
  nth = n;
  wordsDiv.innerHTML = ''; // empty
  columns = [];
  guesses = [];
  targets = [];
  gameOver = false;
  let targetWords = getTargetWords(n)
  for (let i=0; i<n; i++) {
    let column = makeColumn(limit);
    column.target = targetWords[i];
    column.col.role = `Word number ${i+1}`
    targets.push(targetWords[i]);
    wordsDiv.appendChild(column.col);
    columns.push(column);    
  }  
  wordsDiv.style.setProperty(
    '--n',`${n}`
  );
  wordsDiv.style.setProperty(
    '--limit',
    `${limit}`
  );
}

function makeGradient (ltr) {
  let bg = 'linear-gradient(90deg ';
  let activeColumns = columns.filter((c)=>!c.complete);
  let start = '0';
  for (let i=0; i<activeColumns.length; i++) {
    let color = activeColumns[i].letters[ltr];
    let endn = (100 / activeColumns.length) * (i+1);
    let end = `${endn}%`;
    bg = `${bg}, ${color} ${start} ${end}`;
    start = end;
  }
  bg = bg + ')';
  return bg;
}
