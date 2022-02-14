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
  rowDiv.setAttribute('role','row');
  kbd.appendChild(rowDiv);
  for (let ltr of r.split('')) {
    let button = document.createElement('button');
    button.innerText = ltr;
    button.setAttribute('role','gridcell');
    button.setAttribute('aria-label',ltr) ;
    button.setAttribute('tabindex','0');
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
enterButton.classList.add('wide');
enterButton.innerHTML = '<span class="big"> Enter</span> ⏎';
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
deleteButton.classList.add('wide');
deleteButton.innerText = '⌫';
deleteButton.addEventListener(
  'click',
  function () {
    word = word.substr(0,word.length-1);
    changeListener(word);
  }
)
document.querySelector('#keyboard div:nth-child(3) button:nth-child(1)').insertAdjacentElement('beforebegin',enterButton);
document.querySelector('#keyboard div:nth-child(3)').appendChild(deleteButton);

buttons['del'] = deleteButton;
buttons['enter'] = enterButton;

window.addEventListener(
  'keydown',
  function (event) {
    if (event.ctrlKey || event.metaKey) {
      return false;
    }
    var button;
    if (buttons[event.key]) {
      button = buttons[event.key];            
    } 
    else if (event.key=='Enter') {
      button = enterButton;
    }
    else if (event.key=='Backspace') {
      button = deleteButton;
    } else {
      console.log('Ignore',event.key)
    }
    if (button) {
      button.classList.add('active');
      button.click(); 
      event.preventDefault();     
    }

  }
)

export function setKeyBackground (letter, bg) {
  buttons[letter].style.background = bg;
  buttons[letter].classList.add('inverse');
}

export function resetKeyboard () {
  for (let k in buttons) {
    buttons[k].style.background = '';
    buttons[k].classList.remove('inverse');
  }
}

for (let nm in buttons) {
  let button = buttons[nm];
  button.addEventListener(
    'animationend',
    function (event) {
      event.target.classList.remove('active');
    }
  )
}