

const board = document.querySelector('#gameBoard');
let level = 'easy';

function buildBoard(level) {
  let size = 4;
  let htmlTextToAdd = '';
  board.innerHTML = '';
  for (let r = 1; r <= size*size; r++){
    htmlTextToAdd += '<div class="cardContainer"><div class="card"><div class="front">front</div><div class="back">back</div></div></div>';
  }
  board.insertAdjacentHTML('afterbegin',htmlTextToAdd);
}
// function buildBoard(level) {
//   let size = 4;
//   let htmlTextToAdd = '';
//   board.innerHTML = '';
//   for (let r = 1; r <= size; r++){
//     htmlTextToAdd += '<tr>'
//     for (let c = 1; c <= size; c++){
//       htmlTextToAdd += '<td class="card"></td>'
//     }
//     htmlTextToAdd += '</tr>'
//   }
//   board.insertAdjacentHTML('afterbegin',htmlTextToAdd);
// }

function flipCard(event) {
  let card = event.target;
    card.firstChild.classList.toggle("flip");

}

buildBoard(level);
board.addEventListener('click',flipCard);
