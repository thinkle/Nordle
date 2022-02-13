function countLetter (word, letter) {
  let count = 0;
  for (let ltr of word) {
    if (ltr==letter) {
      count += 1
    }
  }
  return count;
}

export function checkWordle (guess, word) {
  guess = guess.toLowerCase();
  word = word.toLowerCase();
  let results = [];  
  let matches = {}
  for (let i=0; i<word.length; i++) {
    let ltr = guess[i];
    if (word[i]==ltr) {
      results.push('🟩');
      if (!matches[ltr]) {
        matches[ltr] = 0
      }
      matches[ltr] += 1
    } else if (word.indexOf(ltr)==-1) {
      results.push('⬛');
    } else {
      results.push('?');
    }
  }
  for (let i=0; i<results.length; i++) {
    let result = results[i];
    if (result=='?') {
      let ltr = guess[i];
      let numberInWord = countLetter(word,ltr);
      let numberAlreadyFound = matches[ltr] || 0
      if (numberInWord - numberAlreadyFound > 0) {
        results[i] = '🟨';
        matches[ltr] = numberAlreadyFound + 1;
      } else {
        results[i] = '⬛';
      }
    }
  }
  let result = results.join(' ');  
  return result;
}

function testCheck () {
  // guess, word
  console.log('teete/elite',checkWordle('teete','elite'))
  console.log('Expect', '⬛ ⬛ 🟨 🟩 🟩')
  console.log('seven/zesty',checkWordle('seven','zesty'))
  console.log('Expect', '🟨 🟩 ⬛ ⬛ ⬛ ')
  console.log('eeven/zesty',checkWordle('eeven','zesty'))
  console.log('Expect', '⬛ 🟩 ⬛ ⬛ ⬛ ')
}


