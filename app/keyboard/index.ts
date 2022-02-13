import './style.css';
import {wordSize} from '../wordle/';
type stringCallback = (word : string) => void;
type completeCallback = (word : string) => boolean;
let changeListener : stringCallback = function (word : string) {
  console.log('Typed: ',word);
}

let wordListener : completeCallback = function (word : string) {
  return false;
}

export function onWordChange (cb : stringCallback) {
  changeListener = cb;
}

export function onWordCommit (cb : completeCallback) {
  wordListener = cb;
}

let rows = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm'
]
let word = '';
let kbd = document.querySelector('#keyboard');
let buttons = {};

kbd.addEventListener(
  'animationend',
  function () {
    kbd.classList.remove('over');
  }
)

for (let r of rows) {
  let rowDiv = document.createElement('div');
  kbd.appendChild(rowDiv);
  for (let ltr of r.split('')) {
    let button = document.createElement('button');
    button.innerText = ltr;
    rowDiv.appendChild(button);
    buttons[ltr] = button;
    button.addEventListener(
      "click",
      function (event) {
        if (word.length < wordSize) {
          word = word + ltr;
          changeListener(word);        
        } else {
          kbd.classList.add('over');
        }
      }
    )
  }
}

// Enter Button
let enterButton = document.createElement('button');
enterButton.innerText = 'Enter';
enterButton.addEventListener(
  'click',
  function () {
    if (!wordListener(word)) {
      word = '';
    }
  }
)


// Delete Button
let deleteButton = document.createElement('button');
deleteButton.innerText = 'Del';
deleteButton.addEventListener(
  'click',
  function () {
    word = word.substr(0,word.length-1);
    changeListener(word);
  }
)
document.querySelector('#keyboard div:nth-child(3) button:nth-child(1)').insertAdjacentElement('beforebegin',enterButton);
document.querySelector('#keyboard div:nth-child(3)').appendChild(deleteButton);

window.addEventListener(
  'keydown',
  function (event) {
    if (event.ctrlKey || event.metaKey) {
      console.log('ignore shift!');
      return false;
    }
    if (buttons[event.key]) {
      buttons[event.key].focus();
      buttons[event.key].click();
      event.preventDefault();
    } 
    else if (event.key=='Enter') {
      enterButton.focus();
      enterButton.click();
      event.preventDefault();
    }
    else if (event.key=='Backspace') {
      deleteButton.focus();
      deleteButton.click();
      event.preventDefault();
    } else {
      console.log('Ignore',event.key)
    }

  }
)

export function setKeyBackground (letter, bg) {
  buttons[letter].style.background = bg;
}