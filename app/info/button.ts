console.log('load button!')

let span = document.createElement('span');

span.innerHTML = `
  <button class="info">?</button>
  <div class="tooltip">
    How to Play Nordle
  </div>
`
span.classList.add('info');

let header = document.querySelector('h1');
header.insertAdjacentElement(
  'afterend',
  span
)

export let button = span.querySelector('button');
