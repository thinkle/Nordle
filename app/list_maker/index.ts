console.log("whaaaa");
import wordurl from "./frequency_list.txt";
import { allWords } from "../wordle/";
import { words } from "../wordle/words";
import { excludes } from "./proper";
console.log("We have ", words.length, "words:", words);
let wordK = {};
words.map((w) => (wordK[w] = 1));
let uniqueWords = Object.keys(wordK);
console.log("We should have ", uniqueWords.length, "words:", words);
uniqueWords.sort((a, b) => Math.random() * 2 - 1);
console.log("Randomized are: ", uniqueWords);

export const wordsByLength = {};
var client = new XMLHttpRequest();
client.open("GET", wordurl);
client.onreadystatechange = function () {
  for (let line of client.responseText.split("\n")) {
    if (line) {
      let [ordinal, rank, word] = line.split(/\s/);
      if (excludes.indexOf(word) == -1) {
        let ordinalNumber = Number(ordinal);
        let rankNumber = Number(rank);
        if (!wordsByLength[word.length]) {
          wordsByLength[word.length] = [];
        }
        wordsByLength[word.length].push({
          ordinal: ordinalNumber,
          rank: rankNumber,
          word,
        });
      }
    }
  }
  if (wordsByLength[5]) {
    wordsByLength[5].sort((a, b) => a.rankNumber - b.rankNumber);
    console.log("5 letter words:", wordsByLength[5]);
    console.log(
      "5 letter words in our dictionary but not on our list by length:"
    );
    let keepers = wordsByLength[5].filter(
      (entry) =>
        allWords.indexOf(entry.word) > -1 && words.indexOf(entry.word) == -1
    );
    console.log(keepers);
    console.log("5 letter words not in our dictionary:");
    console.log(
      wordsByLength[5].filter((entry) => allWords.indexOf(entry.word) == -1)
    );
    console.log("5 letter words that ARE in our dictionary");
    console.log(
      wordsByLength[5].filter((entry) => allWords.indexOf(entry.word) > -1)
    );

    console.log("Keepers:", keepers.map((e) => e.word).slice(0, 500));
  }
  console.log("All words by length:", wordsByLength);
};
client.send();
