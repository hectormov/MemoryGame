

const board = document.querySelector('#gameBoard');
const headerTimer = document.querySelector('.time');
const resetButton = document.querySelector('button');
const moveCounter = document.querySelector('.moves');
const starsSpan = document.querySelector('#stars');
const modal = document.querySelector('#modal');
const modalCloseX = document.querySelector('.close');
const resetLink = document.querySelector('.reset');
const easyLevel = document.querySelector('#easyLevel');
const hardLevel = document.querySelector('#hardLevel');

let level = 'easy';
let card1 = '';
let moves = 0;
let foundPairCount = 0;
let timer = null;
let count = 0;
let deck = [''];

/*
Creates the board with a certain amount of cards (Default 4x4)
TODO: I want to introduce different difficulty levels with more cards so I thought to create this dynamically
and not set the deck to fixed.
*/
function buildBoard(level) {
  let size = level === 'easy' ? 16 : 36;
  let htmlTextToAdd = '';
  cardChooser();
  board.innerHTML = '';
  for (let i = 0; i < size; i++){
    htmlTextToAdd += '<div class="cardContainer ' + level + '"><div class="card"><div class="front"><span class="icon">'+deck[i]+'</span></div><div class="back"></div></div></div>';
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
    let flipLevel = level === 'easy' ? 800 : 400;
    fail(pickedCard, card1);
    setTimeout(function () {
      pickedCard.parentElement.classList.toggle("flip");
      card1.parentElement.classList.toggle("flip");
      fail(pickedCard, card1);
      card1 = '';
    },flipLevel);
    increaseMoves();
    return;
  }
  matchFound(pickedCard);
  increaseMoves();
  let foundPairTarget = level === 'easy' ? 8 : 18;
  if (foundPairCount === foundPairTarget) {
    winner();
  }
  else {
    card1 = '';
  }
}

function fail(pickedCard, card1) {
  pickedCard.classList.toggle("fail");
  card1.classList.toggle("fail");
  pickedCard.parentElement.parentElement.classList.toggle("shake");
  pickedCard.firstElementChild.classList.toggle('shake');
  card1.parentElement.parentElement.classList.toggle("shake");
  card1.firstElementChild.classList.toggle('shake');
}

//Marks the cards are found so they are not clickable again and stay flipped, increases the found pairs count
function matchFound(pickedCard) {
  card1.parentElement.classList.add("found");
  pickedCard.parentElement.classList.add("found");

  pickedCard.parentElement.parentElement.classList.toggle("bounce");
  pickedCard.firstElementChild.classList.toggle('bounce');
  card1.parentElement.parentElement.classList.toggle("bounce");
  card1.firstElementChild.classList.toggle('bounce');
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
  starsSpan.innerText = "🌟🌟🌟"
}

function winner() {
  stopTimer();
  showModal();
}

//Updates the rating according to certain moves, must change to parameters once difficulty is implemented
function checkRating() {
  if (level === 'easy') {
    switch (moves) {
      case 11:
        starsSpan.innerText = "🌟🌟"
        break;
      case 16:
        starsSpan.innerText = "🌟"
        break;
      default:
        break;
    }
  } else {
    switch (moves) {
      case 22:
        starsSpan.innerText = "🌟🌟"
        break;
      case 32:
        starsSpan.innerText = "🌟"
        break;
      default:
        break;
    }
  }
}

function showModal() {
  let finalTime = document.querySelector('.finalTime');
  let finalRating = document.querySelector('.modal-content .stars');
  finalTime.innerText = time;
  finalRating.innerText = starsSpan.innerText;
  modal.style.display = "block";
}

function hideModal() {
  modal.style.display = "none"
}

/* Fisher-Yates shuffle algorithm
   Basically grabs the array, generates a random number based on the number of indexes left,
   and switches those numbers
*/
function shuffle(array) {
  let index = array.length;
  let temp;
  let randomIndex;
  while (0 !== index) {
    randomIndex = Math.floor(Math.random() * index);
    index -= 1;
    temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

//8 hard coded, has to change with levels
function cardChooser() {
  let symbols = [
    "♶","♻","⚐","⚑","⚽","⚾","⛳","♜",
    "♖","☺","✐","✈","✇","😈","😐","😑",
    "😼","😺","➇","❽","☣","☠","😅","😇",
    "😎","😭","🙈","🙅","✆","✋","😤","🙉",
    "⚥","⚦","☔","☕","♣","♫","♡"];
  shuffle(symbols);
  symbols.length = level === 'easy' ? 8 : 18;
  let totalCards = symbols.length;
  for (let i = 0; i < totalCards ; i++){
    symbols.push(symbols[i]);
  }
  shuffle(symbols);
  deck = symbols;
}

buildBoard(level);

// Events
board.addEventListener('click',flipCard);
resetButton.addEventListener('click',reset);
resetLink.addEventListener('click',reset);
modalCloseX.addEventListener('click',hideModal);
modal.addEventListener('click', hideModal);
easyLevel.addEventListener('click', function() {
  level = 'easy';
  reset();
});
hardLevel.addEventListener('click', function() {
  level = 'hard';
  reset();
});
