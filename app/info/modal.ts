let modalWrap = document.createElement("div");
document.documentElement.appendChild(modalWrap);

modalWrap.innerHTML = `
  <div class="modal about">
    
  </div>

`;
let modal = document.querySelector(".modal.about");
export function hideModal() {
  modal.classList.remove("active");
}

export function toggleModal() {
  if (modal.classList.contains("active")) {
    hideModal();
  } else {
    showModal();
  }
}

export function showModal() {
  modal.classList.add("active");
  modal.innerHTML = `
  <button class="close">&times;</button>
  <p>So you've played wordle, right?</p>
    <p>This game is that, but more.</p>
    <p>Enter one 5&ndash;letter word at a time and get feedback on <b>n</b> words simultaneously.</p>
    <p>Your goal is to guess all <b>n</b> words
    in <b>n+5</b> guesses.</p>
    <p>There is one puzzle per day per value
    of <b>n</b>. Which is to say, there are a
    <em>lot</em> of puzzles each day :) </p>
    <h3>Haven't played wordle?</h3>
    <p>Ok, fair enough. I'm thinking of a 5-letter word (or in nordle's case, <b>n</b> 5-letter words).</p>
    <p>You enter a guess and 
    I'll color the squares to tell you about
    how each letter compares to the letters in the word(s) I'm
    thinking of:</p>  
    <table>
    <tr>
      <td> 
      <span class="block green">
        G
      </span> </td>
      <td> 
        Letter is in this position in the word.
      </td>
    </tr>
    <tr>
      <td><span class="block yellow">
        Y
      </span> </td>
      <td> 
        Letter is in the word, but in a different position.
      </td>
    </tr>
    <tr>
      <td><span class="block grey">
        B
      </span> </td>
      <td> 
        Letter is not in the word.
      </td>
    </tr>
    </table>
    <h3>About the Author</h3>
    <p>This is written by 
    <a href="mailto:tmhinkle@gmail.com">Tom Hinkle</a>. Game is
    (obviously) inspired by the original Wordle
    by Josh Wardle and also by the Dordle.</p>
    <p>I aimed to bring back some of the attention
    to detail that made the original so delightful.
    </p>
    <p>Note: I've also worked to make sure this
    game is accessible for all users. Let me know
    if you're having any accessibility-related
    issues.</p>
    <p>Like the font? The grid contains a mono serif beta version of
    <a href="https://djr.com/">David Jonathan Ross's</a> 
    <a href="https://djr.com/input/">Input Font</a>, which he was kind enough
    to send me for use in this application. I think it looks pretty great.
    </p>

    `;
  modal.querySelector(".close").addEventListener("click", hideModal);
}
