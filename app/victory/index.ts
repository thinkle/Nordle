import './style.css';
import {guesses,targets,nth} from '../wordDisplay';
import {drawVictory} from './draw';
export function showVictory (correct, total) {
  debugger;
  let vdiv = document.querySelector('#victory');
  vdiv.innerHTML = `
    <div class="center">
      <div class="msg" style="font-weight:bold">      
        <a href="${window.location}">Nordle ${new Date().toLocaleDateString()} n=${nth}, ${correct}/${total}</a>
        
      <div id="draw"></div>
    </div>    
    <button class="cp">Copy</button>
    <button class="c">Close</button>
    </div>
  `;
  let cb = vdiv.querySelector('button.c');
  cb.addEventListener(
    'click',
    function () {
      vdiv.classList.remove('active');
    }
  )
  let canvas = document.createElement('canvas');
  document.documentElement.appendChild(canvas);
  drawVictory(canvas,guesses,targets);
  vdiv.classList.add('active');

  let copyButton = vdiv.querySelector('.cp');
  let content = vdiv.querySelector('.msg');
  copyButton.addEventListener(
    'click',
    function () {
      let blob = new Blob([content.innerHTML], { type: "text/html" });
    const item = new ClipboardItem({ "text/html": blob });
    navigator.clipboard.write([item]);
    }
  )
}