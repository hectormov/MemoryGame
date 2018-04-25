const board = document.querySelector('.game-board');
const headerTimer = document.querySelector('.time');
const resetButton = document.querySelector('button');
const moveCounter = document.querySelector('.moves');
const gameStars = document.querySelector('.game-stars');
const modal = document.querySelector('.modal');
const modalCloseX = document.querySelector('.close');
const resetLink = document.querySelector('.reset');
const easyLevel = document.querySelector('.easy-level');
const hardLevel = document.querySelector('.hard-level');

let level = 'easy';
let card1 = '';
let moves = 0;
let foundPairCount = 0;
let timer = null;
let count = 0;
let deck = [''];
let time = null;

/*
Creates the board with a certain amount of cards (Default 4x4) based on the difficulty selected
*/
function buildBoard(level) {
  let size = level === 'easy' ? 16 : 36;
  let htmlTextToAdd = '';
  cardChooser();
  board.innerHTML = '';
  for (let i = 0; i < size; i++){
    htmlTextToAdd += '<div class="card-container ' + level +
    '"><div class="card"><div class="front"><span class="icon">' +
    deck[i] + '</span></div><div class="back"></div></div></div>';
  }
  board.insertAdjacentHTML('afterbegin',htmlTextToAdd);
}

/*
As long as only the front or back are clicked, it flips the card, additionally if the back is clicked
we call compareCards to check if the front matches
*/
function flipCard(event) {
  toggleClicking(board);
  let card = event.target;
  if (card.classList.contains('front') || card.classList.contains('back')) {
    card.parentElement.classList.toggle("flip");
    if (card.classList.contains('back')) {
      let pickedCard = card.previousElementSibling;
      setTimeout(function () {
        compareCards(pickedCard);
      },300);
    }
  }
  let flipLevel = level === 'easy' ? 300 : 200;
  setTimeout(function () {
    toggleClicking(board);
  }, flipLevel);
}

/*
This function is used to disable clicking on the gameboard while the animations are executing
This prevents an edge case when clicking very fast on the cards then more than 2 cards
may flip at the same time not comparing the right ones.
*/
function toggleClicking(element) {
  element.classList.toggle("no-click");
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
    let flipLevel = level === 'easy' ? 400 : 200;
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

/*
Adds the classes for animations when the selected pair do not match
Fail adds color, shake animates the image, and it is applied to both the card and the icon
*/
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
  card1.parentElement.classList.add("no-click");
  pickedCard.parentElement.classList.add("no-click");
  pickedCard.parentElement.parentElement.classList.toggle("bounce");
  pickedCard.firstElementChild.classList.toggle('bounce');
  card1.parentElement.parentElement.classList.toggle("bounce");
  card1.firstElementChild.classList.toggle('bounce');
  card1.classList.toggle('found-pair');
  pickedCard.classList.toggle('found-pair');
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
  gameStars.innerText = "🌟🌟🌟";
}

function winner() {
  stopTimer();
  showModal();
}

//Updates the rating according to certain moves and the difficulty selected
function checkRating() {
  if (level === 'easy') {
    switch (moves) {
      case 11:
        gameStars.innerText = "🌟🌟";
        break;
      case 16:
        gameStars.innerText = "🌟";
        break;
      default:
        break;
    }
  } else {
    switch (moves) {
      case 22:
        gameStars.innerText = "🌟🌟";
        break;
      case 32:
        gameStars.innerText = "🌟";
        break;
      default:
        break;
    }
  }
}

/* Updates data of the modal with final results and then it brings it up */
function showModal() {
  let finalTime = document.querySelector('.final-time');
  let finalRating = document.querySelector('.modal-stars');
  finalTime.innerText = time;
  finalRating.innerText = gameStars.innerText;
  modal.style.display = "block";
}

function hideModal() {
  modal.style.display = "none";
}

/* Fisher-Yates shuffle algorithm
   Grabs the array, generates a random number based on the number of indexes left,
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

buildBoard(level);
