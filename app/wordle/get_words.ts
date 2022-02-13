import {words} from './words';

const startDate = new Date(2022,0,27);

function getWord() {
  let now = new Date().getTime()
  let distance = now - startDate.getTime();
  let daysPassed = Math.floor(distance / (1000 * 60 * 60 * 24));
  return words[daysPassed % words.length];  
}

function testGetWord () {
  console.log(getWord())
}