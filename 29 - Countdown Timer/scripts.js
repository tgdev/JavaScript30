let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

const timer = function timer(seconds) {
  clearInterval(countdown); // clear exiting timers
  const now = Date.now();
  const then = now + seconds * 1000;

  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft <= 0) {
      clearInterval(countdown);
      return;
    }

    displayTimeLeft(secondsLeft);

  }, 1000);
};

const displayTimeLeft = function displayTimeLeft(seconds) {
  let secondsRemaining = seconds;

  const hours = Math.floor(secondsRemaining / 3600);
  secondsRemaining = secondsRemaining % 3600;
  const minutes = Math.floor(secondsRemaining / 60);
  secondsRemaining = secondsRemaining % 60;

  const displayHours = hours > 0 ? `${hours}:` : '';
  const displayMins = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;

  const display = `${displayHours}${displayMins}:${displaySeconds}`;

  document.title = display;
  timerDisplay.textContent = display;
};

const displayEndTime = function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
};

const startTimer = function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
};

const startCustomTimer = function startCustomTimer(e) {
  e.preventDefault();
  const mins = parseInt(this.minutes.value);
  timer(mins * 60);
  this.reset();
};

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', startCustomTimer);
