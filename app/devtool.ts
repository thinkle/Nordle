import {alpha} from './wordle/alpha';
import {allWords} from './wordle';

// list 5-letter words not yet on our list
if (false) {
  let cont = document.querySelector('#words')
  let ul = document.createElement('pre');
  cont.appendChild(ul);
  ul.style.position = 'fixed';
  ul.style.height = '100vh'
  ul.style.top = '0';
  ul.style.fontSize = '14pt';
  ul.style.backgroundColor = 'black';
  ul.style.color = 'green';
  ul.style.overflowY = 'scroll';
  ul.style.width = '300px';
  ul.innerHTML = allWords.filter((w)=>w[0]!='a'&&w.length==5&&w[4]!='s'&&alpha.indexOf(w)==-1).map((w)=>`'${w}',`).join('\n');
}

// randomize current list...
if (false) {
  let cont = document.querySelector('#words')
  let ul = document.createElement('pre');
  cont.appendChild(ul);
  ul.style.position = 'fixed';
  ul.style.height = '100vh'
  ul.style.top = '0';
  ul.style.fontSize = '14pt';
  ul.style.backgroundColor = 'black';
  ul.style.color = 'green';
  ul.style.overflowY = 'scroll';
  ul.style.width = '300px';
  ul.innerHTML = alpha.sort(
    (a,b)=>Math.random()*2-1
  ).map((w)=>`'${w}'`).join(',');
}