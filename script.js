// JavaScript = WHAT THE WEBSITE DOES.
// HTML makes buttons and number boxes; JavaScript makes them work.

// STEP 1: Find the things we created in index.html.
const hoursBox = document.getElementById('hoursInput');
const minutesBox = document.getElementById('minutesInput');
const secondsBox = document.getElementById('secondsInput');
const display = document.getElementById('display');
const statusText = document.getElementById('status');
const dial = document.getElementById('dial');
const startButton = document.getElementById('startPause');
const resetButton = document.getElementById('reset');
// const countButton = document.getElementById('countUP_DOWN');
const presets = document.querySelectorAll('[data-seconds]');
const timeBoxes = [hoursBox, minutesBox, secondsBox];

// STEP 2: Remember the timer's current situation.
let state = 'idle';                    // idle, running, paused, or finished
let totalMilliseconds = 60 * 1000;    // the original length of the countdown
let remainingMilliseconds = totalMilliseconds;
let finishTime = 0;                   // the actual clock time when it should finish
let tickingInterval = null;
let audioContext = null;

// STEP 3: Turn HOURS + MINUTES + SECONDS into just SECONDS.
const alarmSound = new Audio("./alarm.mp3");
  alarmSound.preload = "auto";

function readTotalSeconds() {
  const maximums = [999, 59, 59];
  const numbers = timeBoxes.map((box, index) => {
    const number = Number(box.value || 0);
    if (!Number.isSafeInteger(number) || number < 0 || number > maximums[index]) {
      return null;
    }
    return number;
  });

  if (numbers.includes(null)) return null;
  const hours = numbers[0];
  const minutes = numbers[1];
  const seconds = numbers[2];
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return totalSeconds > 0 ? totalSeconds : null;
}

// STEP 4: Show a SINGLE number (seconds), not 00:00:00.
function drawTimer() {
  const secondsLeft = Math.ceil(remainingMilliseconds / 1000);
  display.textContent = String(secondsLeft);
  display.classList.toggle('long-number', secondsLeft >= 100000);

  const fractionFinished = totalMilliseconds > 0
    ? 1 - remainingMilliseconds / totalMilliseconds
    : 0;
  const percent = Math.max(0, Math.min(100, fractionFinished * 100));
  dial.style.setProperty('--progress', `${percent}%`);
}

function drawButtons() {
  const inProgress = state === 'running' || state === 'paused';
  timeBoxes.forEach(box => { box.disabled = inProgress; });
  presets.forEach(button => { button.disabled = inProgress; });
  startButton.textContent = state === 'running' ? 'Pause' :
                            state === 'paused' ? 'Resume' : 'Start timer';

  const messages = {
    idle: 'Ready when you are',
    running: 'Counting down…',
    paused: 'Paused',
    finished: 'Time is up!'
  };
  statusText.textContent = messages[state];
}

function stopTicking() {
  if (tickingInterval !== null) {
    clearInterval(tickingInterval);
    tickingInterval = null;
  }
}

// Optional extra: play a small beep when the timer finishes.
// iPhones might block this sound if the phone is locked or the app is backgrounded.
function prepareAudio() {
  try {
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (AudioContextType && !audioContext) audioContext = new AudioContextType();
    if (audioContext?.state === 'suspended') audioContext.resume().catch(() => {});
  } catch (_) { /* The timer works even when audio is unavailable. */ }
}

function beep() {
  alarmSound.currentTime = 0;

  alarmSound.play().catch((error) => {
    console.error("could not play sound:", error);
  })
}

function finishCountdown() {
  if (state !== 'running') return;
  stopTicking();
  remainingMilliseconds = 0;
  state = 'finished';
  drawTimer();
  drawButtons();
  beep();
  if ('vibrate' in navigator) navigator.vibrate([180, 90, 180]);
}

// STEP 5: Check the REAL CLOCK, rather than subtracting 1 each second.
// This prevents most drifting if your phone slows down or hides the webpage.
function tick() {
  if (state !== 'running') return;
  remainingMilliseconds = Math.max(0, finishTime - Date.now());
  if (remainingMilliseconds === 0) finishCountdown();
  else drawTimer();
}

// STEP 6: What happens when you tap Start / Pause / Resume?
function startOrPause() {
  if (state === 'running') {
    remainingMilliseconds = Math.max(0, finishTime - Date.now());
    if (remainingMilliseconds === 0) { finishCountdown(); return; }
    stopTicking();
    state = 'paused';
  } else {
    if (state !== 'paused') {
      const chosenSeconds = readTotalSeconds();
      if (chosenSeconds === null) {
        statusText.textContent = 'Enter a time above zero (minutes/seconds: 0–59).';
        return;
      }
      totalMilliseconds = chosenSeconds * 1000;
      remainingMilliseconds = totalMilliseconds;
    }

    prepareAudio();
    finishTime = Date.now() + remainingMilliseconds;
    state = 'running';
    stopTicking();
    tickingInterval = setInterval(tick, 100);
    tick();
  }
  drawButtons();
  drawTimer();
}

function resetTimer() {
  stopTicking();
  state = 'idle';
  const chosenSeconds = readTotalSeconds();
  totalMilliseconds = (chosenSeconds ?? 0) * 1000;
  remainingMilliseconds = totalMilliseconds;
  drawTimer();
  drawButtons();
  if (chosenSeconds === null) {
    statusText.textContent = 'Enter a time above zero (minutes/seconds: 0–59).';
  }
}

// STEP 7: Connect the buttons and number boxes to the functions above.
startButton.addEventListener('click', startOrPause);
resetButton.addEventListener('click', resetTimer);
timeBoxes.forEach(box => {
  box.addEventListener('input', resetTimer);
});
presets.forEach(button => {
  button.addEventListener('click', () => {
    const totalSeconds = Number(button.dataset.seconds);
    hoursBox.value = Math.floor(totalSeconds / 3600);
    minutesBox.value = Math.floor((totalSeconds % 3600) / 60);
    secondsBox.value = totalSeconds % 60;
    resetTimer();
  });
});

// When the app is shown again after being hidden, catch the time up.
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
window.addEventListener('pageshow', tick);

// Show the default one-minute countdown when the webpage first opens.
resetTimer();

// Bonus: offline access after you have visited the published HTTPS website.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}


