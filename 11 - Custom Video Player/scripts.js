'use strict';

// get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const fullscreenButton = player.querySelector('.full');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// const height = video.videoHeight;
// const width = video.videoWidth;

// build functions
const togglePlay = function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
};

const updateButton = function updateButton() {
  const icon = this.paused ?  '►' : '❚❚';
  toggle.textContent = icon;
};

const skip = function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
};

const handleRangeUpdate = function handleRangeUpdate() {
  video[this.name] = this.value;
};

const handleProgress = function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
};

const scrub = function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
};

const triggerFullscreen = function toggleFullscreen() {

  if (document.fullscreenElement) {

    // console.log('in full screen');
    document.exitFullscreen()

  } else {

    // console.log('not in fullscreen');
    if (video.requestFullscreen) {

      video.requestFullscreen();

    } else if (video.mozRequestFullScreen) {

      video.mozRequestFullScreen();

    } else if (video.webkitRequestFullscreen) {

      video.webkitRequestFullscreen();

    }

  }

};

/*
 * Wireup event listeners
 */

// Play / Pause
document.addEventListener('keydown', e => {
  // spacebar pressed
  if (e.keyCode === 32) {
    // Remove focus from any focused element
    if (document.activeElement) {
      document.activeElement.blur();
    }
    togglePlay();
  }
});
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
toggle.addEventListener('click', togglePlay);

// Progress bar
let mouseDown = false;
video.addEventListener('timeupdate', handleProgress);
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mouseDown && scrub(e));
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);

// Skip back & forward
skipButtons.forEach(button => button.addEventListener('click', skip));

// Adjust volume & playback speed
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', handleRangeUpdate);
});

// Fullscreen
fullscreenButton.addEventListener('click', triggerFullscreen);
