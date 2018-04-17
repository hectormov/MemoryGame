

const board = document.querySelector('#gameBoard');


let level = 'easy';
let card1 = '';
let moves = 0;

function buildBoard(level) {
  let size = 4;
  let htmlTextToAdd = '';
  board.innerHTML = '';
  for (let i = 1; i <= size*size; i++){
    htmlTextToAdd += '<div class="cardContainer"><div class="card"><div class="front">front</div><div class="back">back'+i+'</div></div></div>';
  }
  board.insertAdjacentHTML('afterbegin',htmlTextToAdd);
}

function flipCard(event) {
  let card = event.target;
  if (card.id !== 'gameBoard' && !card.classList.contains("cardContainer")
  && !card.classList.contains("card") && card1 !== card) {
    console.log(card);
    card.parentElement.classList.toggle("flip");
    if (card.classList.contains('back')) {
      let pickedCard = card.previousElementSibling;
      setTimeout(function (){
        compareCards(pickedCard);
      },500)
    }
  }
}

function compareCards(pickedCard) {
  console.log(pickedCard);
  if (card1 === '') {
    card1 = pickedCard;
    return;
  }
  else if (card1.innerText == pickedCard.innerText) {
    pickedCard.parentElement.classList.toggle("flip");
    card1.parentElement.classList.toggle("flip");
    card1 = '';
    increaseMoves();
    return;
  }
  matchFound(pickedCard);
  increaseMoves();
  card1 = '';
}

function matchFound(pickedCard) {
  card1.parentElement.classList.add("found");
  pickedCard.parentElement.classList.add("found");
}

function increaseMoves() {
  const moveCounter = document.querySelector('.moves');
  moveCounter.innerText = parseInt(moveCounter.innerText) + 1;
  return moves;
}

buildBoard(level);
board.addEventListener('click',flipCard,true);
