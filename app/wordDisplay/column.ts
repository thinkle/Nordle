import {wordSize} from '../wordle';
import {checkWordle} from '../wordle';
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

export function makeColumn (guesses : number) : Column {
  let col = document.createElement('ul');
  col.classList.add('column')
  let firstGuess : HTMLLIElement;
  for (let i=0; i<guesses; i++) {
    let guess = document.createElement('li');
    guess.classList.add('guess')
    for (let ltr=0; ltr<wordSize; ltr++) {
      let span = document.createElement('span');
      guess.appendChild(span);
    }
    col.appendChild(guess);    
    if (!firstGuess) {
      firstGuess = guess;
    }
  }
  let timeouts = [];
  

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
      let result = checkWordle(word,this.target).split(/\s/);
      this.currentRow.classList.add('reveal');
      let correct = true;
      for (let i=0; i<this.currentRow.children.length; i++) {
        let childSpan = this.currentRow.children[i];
        let revealSpan = document.createElement('span');
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
        revealSpan.addEventListener(
          "animationend",
          (event) => {
            revealSpan.style.transform = 'translateX(0)';
          }
        );        
      }
      if (correct) {
        this.complete = true;
        window.setTimeout(
          ()=>this.col.classList.add('complete'),
          2000
        )        
      }
      this.currentRow = next;
    },
    onChange : function (word : string) {
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