import {wordSize} from '../wordle';
import {checkWordle, a11ySquares} from '../wordle';
import {gameOver} from './index';
const G = 'var(--green,green)';
const Y = 'var(--yellow,yellow)';
const B = 'var(--grey,grey)';
export type Column = {
  complete: boolean,
  col : HTMLUListElement,
  currentRow : HTMLLIElement,
  onCommit : (word)=>void,
  onChange : (word)=>void,
  target : string,
  indicateBadWord : ()=>void,
  letters : {},
}

function makeAriaInput (el) {
  el.classList.add('active');
  el.setAttribute('tabindex','0')
  el.setAttribute('aria-label','No guess')
  el.setAttribute('role','textbox');
  el.setAttribute('aria-multiline','false')
}

export function makeColumn (nguesses : number) : Column {  
  let col = document.createElement('ul');
  col.classList.add('column')
  let firstGuess : HTMLLIElement;
  for (let i=0; i<nguesses; i++) {
    let guess = document.createElement('li');
    guess.setAttribute('role','guess');
    
    guess.classList.add('guess')
    for (let ltr=0; ltr<wordSize; ltr++) {
      let span = document.createElement('span');
      guess.appendChild(span);
    }
    col.appendChild(guess);    
    if (!firstGuess) {
      firstGuess = guess;
      makeAriaInput(guess);
    }
  }
  let timeouts = [];
  
  function makeA11yResult (result) {

    return result.map(
      (s)=>a11ySquares[s]
    )
  }

  let column = {
    complete : false,
    col : col,
    currentRow : firstGuess,
    target : 'opted',
    letters : {},
    onCommit : function (this: Column, word : string) {
      if (this.complete) {return}
      // Check Word
      // Next word...
      let next : HTMLLIElement = this.currentRow.nextElementSibling;   
      let result = checkWordle(word,this.target);
      let a11yResult = makeA11yResult(result);
      this.currentRow.classList.add('reveal');
      this.currentRow.setAttribute('tabindex','0');
      this.currentRow.setAttribute('role','listitem');
      this.currentRow.setAttribute('aria-label',`Guessed ${word}: Result ${a11yResult}`);
      let correct = true;
      for (let i=0; i<this.currentRow.children.length; i++) {
        let childSpan = this.currentRow.children[i];
        let revealSpan = document.createElement('span');
        revealSpan.setAttribute('aria-hidden','true');        
        childSpan.appendChild(revealSpan);
        revealSpan.innerText = word[i].toUpperCase();     
        let letterResult = result[i];
        if (letterResult=='🟩') {
          childSpan.classList.add('green');
          this.letters[word[i]] = G;
        } else if (letterResult=='🟨') {
          childSpan.classList.add('yellow');
          correct = false;
          if (this.letters[word[i]]!=G) {
            this.letters[word[i]] = Y;
          }
        } else {
          childSpan.classList.add('grey');
          correct = false;
          if (!this.letters[word[i]]) {
            this.letters[word[i]] = B;
          }
        }
        childSpan.insertAdjacentHTML(
          'beforeend',
          `<div class="a11y">${a11yResult[i]}</div>`
        )
        
        revealSpan.addEventListener(
          "animationend",
          (event) => {
            revealSpan.style.transform = 'translateX(0)';
            revealSpan.style.opacity = '1';
          }
        );        
      }
      if (correct) {
        this.complete = true;
        window.setTimeout(
          ()=>!gameOver&&this.col.classList.add('complete'),
          2000
        )        
      }
      let lastRow = this.currentRow;
      window.setTimeout(
        ()=>{
          lastRow.classList.add('no-animate');
        },
        2500
      );
      this.currentRow = next;
      if (this.currentRow) {
        makeAriaInput(this.currentRow);
        
      }
    },
    onChange : function (word : string) {
      let suffix = ''
      if (word.length == wordSize) {
        suffix = ' (type Enter to submit guess)'
      }
      this.currentRow.setAttribute('aria-label',`Current guess: ${word}${suffix}`);
      if (this.complete) {return}
      for (let t of timeouts) {
        window.clearTimeout(t)
      }
      for (var i=0; i<word.length; i++) {
        let ltr :string  = word[i];
        let span : HTMLSpanElement = this.currentRow.children[i];
        span.classList.add('typed');
        span.innerText = ltr.toUpperCase();
      }
      for (i; i<wordSize; i++) {
        let span : HTMLSpanElement = this.currentRow.children[i];
        span.classList.remove('typed');
        timeouts.push(window.setTimeout(
          ()=>span.innerText = '',
          500
        ));
      }
    },

    indicateBadWord : function (this: Column) {
      if (this.complete) {
        return
      }
      console.log('Bad word!');
      this.currentRow.classList.add('bad');
      this.currentRow.setAttribute(
        'aria-label',
        this.currentRow.getAttribute('aria-label')+' Invalid word'
      );
      this.currentRow.addEventListener(
        'animationend',
        function (event) {
          event.target.classList.remove('bad');
        }
      )
    }

  }

  function lose () {
    console.log('You lose');
  }

  return column;
}