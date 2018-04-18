

const board = document.querySelector('#gameBoard');
const headerTimer = document.querySelector('.time');
const resetButton = document.querySelector('button');
const moveCounter = document.querySelector('.moves');
const starsSpan = document.querySelector('.stars');

let level = 'easy';
let card1 = '';
let moves = 0;
let foundPairTarget = 8;
let foundPairCount = 0;
let timer = null;
let count = 0;

/*
Creates the board with a certain amount of cards (Default 4x4)
TODO: I want to introduce different difficulty levels with more cards so I thought to create this dynamically
and not set the deck to fixed.
*/
function buildBoard(level) {
  let size = 4;
  let htmlTextToAdd = '';
  board.innerHTML = '';
  for (let i = 1; i <= size*size; i++){
    htmlTextToAdd += '<div class="cardContainer"><div class="card"><div class="front">front</div><div class="back">back'+i+'</div></div></div>';
  }
  board.insertAdjacentHTML('afterbegin',htmlTextToAdd);
}

/*
As long as only the front or back are clicked, flippes the card, additionally if the back is clicked
we call compareCards to check if the front matches
*/
function flipCard(event) {
  let card = event.target;
  if (card.id !== 'gameBoard' && !card.classList.contains("cardContainer")
  && !card.classList.contains("card") && card1 !== card) {
    card.parentElement.classList.toggle("flip");
    if (card.classList.contains('back')) {
      let pickedCard = card.previousElementSibling;
      setTimeout(function (){
        compareCards(pickedCard);
      },500)
    }
  }
}

/*
Receives the clicked card, if it is the very first card it startes the timer and if it is the
first guess for a pair it stops the function.
If it is the second card of the pair, it compares the content, resets the check for first card of the pair
and increases the move count.
If the cards are different both cards are flipped back
If the cards are the same matchfound function is called.
*/
function compareCards(pickedCard) {
  if (card1 === '') {
    card1 = pickedCard;
    if (moves === 0) {
      startTimer();
    }
    return;
  }
  else if (card1.innerText !== pickedCard.innerText) {
    pickedCard.parentElement.classList.toggle("flip");
    card1.parentElement.classList.toggle("flip");
    card1 = '';
    increaseMoves();
    return;
  }
  matchFound(pickedCard);
  increaseMoves();
  if (foundPairCount === foundPairTarget) {
    winner();
  }
  else {
    card1 = '';
  }
}

//Marks the cards are found so they are not clickable again and stay flipped, increases the found pairs count
function matchFound(pickedCard) {
  card1.parentElement.classList.add("found");
  pickedCard.parentElement.classList.add("found");
  foundPairCount++;
}

function increaseMoves() {
  moves++;
  moveCounter.innerText = moves;
  checkRating();
}

function startTimer() {
  timer = setInterval(function(){
    increaseTime();
  },1000);
}

function increaseTime(){
  count++;
  time = new Date(count * 1000).toISOString().substr(11, 8);
  headerTimer.innerText = time;
}

function stopTimer() {
  clearInterval(timer);
}

//Change all variables used back to default
function reset() {
  card1 = '';
  moves = 0;
  stopTimer();
  headerTimer.innerText = "00:00:00";
  timer = null;
  count = 0;
  moveCounter.innerText = "0";
  foundPairCount = 0;
  buildBoard(level);
  starsSpan.innerText = "***"
}

function winner() {
  stopTimer();
  console.log("WE HAVE A WINNEEEEEEERRRRR!!!!")
}

//Updates the rating according to certain moves, must change to parameters once difficulty is implemented
function checkRating() {
  switch (moves) {
    case 9:
      starsSpan.innerText = "**"
      break;
    case 12:
      starsSpan.innerText = "*"
      break;
    default:
      break;
  }
}

buildBoard(level);

// Events
board.addEventListener('click',flipCard);
resetButton.addEventListener('click',reset);
