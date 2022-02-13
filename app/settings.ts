import {makeColumns} from './wordDisplay';
let nInput : HTMLInputElement = document.querySelector('#n');

nInput.insertAdjacentHTML(
  'afterend',
  `<button class="nb nup">▲</button>
  <button class="nb ndown">▼</button>
  `
);

document.querySelector('.nup')
.addEventListener(
  'click',
  function () {
    nInput.valueAsNumber += 1;
    updateColumns();
  }
)

document.querySelector('.ndown')
.addEventListener(
  'click',
  function () {
    nInput.valueAsNumber -= 1;
    updateColumns();
  }
)


function updateColumns () {
  let v = nInput.valueAsNumber;
  let guesses = 5 + v;
  makeColumns(v,guesses);
}

nInput.addEventListener('change',updateColumns)

updateColumns();
let editMode = true;
export function allowNoMoreChanges () {
  if (editMode) {
  nInput.style.display = 'none';
  for  (let w of document.querySelectorAll('.nb')) {
    w.style.display = 'none';
  }
  nInput.insertAdjacentHTML(
    'afterend',
    `<span class="n">${nInput.value}</span>`
  )
  editMode = false
  }
}