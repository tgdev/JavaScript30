const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const gameOverPanel = document.querySelector('.game-over-panel');

const button = document.querySelector('.btn-start');
const timerDisplay = document.querySelector('.timer');
const hiScoreDisplay = document.querySelector('.hi-score');
const scoreReset = document.querySelector('.reset');

const gameMode = document.querySelector('.game-mode');

// get & set the hiscore value in the UI
let currentHiScore =  localStorage.getItem('hiScore') || 0;
hiScoreDisplay.textContent = currentHiScore;

// set the difficulty of the game
let difficulty = { min: 500, max: 1000 };

// setup the rest of the game
const gameDuration = 10000; // 10 seconds
let countdown;
let lastHole;
let timeUp = false;
let score = 0;

const randomTime = function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

const randomHole = function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];

  if (hole === lastHole) {
    // same hole, run it again!
    return randomHole(holes);
  }

  lastHole = hole;
  return hole;

};

// Show the moles!
const peep = function peep() {
  const time = randomTime(difficulty.min, difficulty.max);
  const hole = randomHole(holes);

  hole.classList.add('up');

  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
};

// Whack the moles!
const bonk = function bonk(e) {
  if (!e.isTrusted) return; // stop cheating!
  this.parentNode.classList.remove('up');
  score++;
  scoreBoard.textContent = score;
};

// start and show the remaining game duration
const startCountdown = function startCountdown() {
  clearInterval(countdown); // clear exiting timers
  const now = Date.now();
  const then = now + gameDuration;

  displayTimeLeft(gameDuration / 1000);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    displayTimeLeft(secondsLeft);

  }, 1000);
};

const displayTimeLeft = function displayTimeLeft(seconds) {
  let secondsRemaining = seconds;

  const minutes = Math.floor(secondsRemaining / 60);
  secondsRemaining = secondsRemaining % 60;
  const displayMins = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;
  const display = `${displayMins}:${displaySeconds}`;

  timerDisplay.textContent = display;
};

const getHiScore = function getHiScore() {
  return localStorage.getItem('hiScore');
};

// Save hi-score to localStorage
const saveHiScore = function saveHiScore() {
  if (score > parseInt(currentHiScore)) {
    localStorage.setItem('hiScore', JSON.stringify(score));
    hiScoreDisplay.textContent = score;
    hiScoreDisplay.classList.add('new-score');
  }
};

const resetHiScore = function resetHiScore(){
    localStorage.setItem('hiScore', JSON.stringify(0));
    hiScoreDisplay.textContent = 0;
    currentHiScore = 0;
};

// Set the game difficulty (Easy, Hard, Expert)
const toggleDifficulty = function toggleDifficulty() {
  // easy mode range is min: 300, max: 1000
  // hard mode range is min: 150, max: 800
  // expert mode range is min: 100, max: 500
  switch (this.value) {
    case 'easy':
      difficulty.min = 500;
      difficulty.max = 1000;
      break;
    case 'hard':
      difficulty.min = 200;
      difficulty.max = 800;
      break;
    case 'expert':
      difficulty.min = 100;
      difficulty.max = 500;
      break;
    default:
      difficulty.min = 500;
      difficulty.max = 1000;
  }
};

// Start a new game
const startGame = function startGame() {
  gameOverPanel.classList.remove('active');
  hiScoreDisplay.classList.remove('new-score');
  button.setAttribute('disabled', 'disabled');
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  currentHiScore = getHiScore();
  peep();
  startCountdown();
  setTimeout(() => {
    endGame();
  }, gameDuration);
};

// Update somethings when game ends after set duration
const endGame = function endGame() {
  // TIME'S UP!!!
  timeUp = true;
  // save the score
  saveHiScore();
  // re-enable the New Game button
  button.removeAttribute('disabled');
  // show "Game over" message;
  gameOverPanel.classList.add('active');
};

button.addEventListener('click', startGame);
gameMode.addEventListener('change', toggleDifficulty);
scoreReset.addEventListener('click', resetHiScore);

moles.forEach(mole => mole.addEventListener('click', bonk));
