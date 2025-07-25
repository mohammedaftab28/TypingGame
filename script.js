// Selecting all required DOM elements
const quoteEl = document.getElementById("quoteDisplay");
const inputEl = document.getElementById("inputBox");
const timerEl = document.getElementById("timer");
const overlay = document.getElementById("overlay");
const resultScreen = document.getElementById("resultScreen");
const wpmDisplay = document.getElementById("wpmDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startButton");
const resetBtn = document.getElementById("resetButton");
const tryAgainBtn = document.getElementById("tryAgain");
const backBtn = document.getElementById("backButton");

// Game state variables
let currentQuote = "";
let startTime, timerInterval;
let isRunning = false;
let correctWordsCount = 0;

// Sound effect for key press
const keySound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-1124.mp3"
);

// Local quote list
const quotes = [
  "Type fast and keep your mind calm.",
  "Words build skill when you type daily.",
  "Keep your hands ready for fast words.",
  "Stay sharp and type with clear focus.",
  "Grow your skill with each word typed.",
  "Each new tap builds better hand speed.",
  "Push your speed without losing your flow.",
  "Calm mind helps you type more fast.",
  "Never stop when things feel too slow.",
  "Let your hands move with soft ease.",
  "Each word you type adds to skill.",
  "Do your best and type with care.",
  "Type smooth and keep your head cool.",
  "Make each word count in your task.",
  "Trust the path your fingers now take.",
  "Fast hands type clear and sharp words.",
  "Your skill builds with each new try.",
  "Type bold and keep your eyes wide.",
  "Stay cool and press each key right.",
  "Each win starts with just one word.",
  "Your hands learn with daily key hits.",
  "Keep going even when you feel slow.",
  "Skill grows when you fail and try.",
  "Be calm and type with firm hands.",
  "One more word makes your day count.",
  "Type right not fast when you learn.",
  "Train each day to grow your pace.",
  "Fast taps help build strong key flow.",
  "Do your best on each short line.",
  "Each tap adds to your finger power.",
  "Keep your focus sharp like your keys.",
  "Smart work wins over rush and mess.",
  "Let speed come with calm and trust.",
  "Each step forward starts with one tap.",
  "Type clean and build strong hand moves.",
  "You get fast when you stay calm.",
  "Type like you care and want growth.",
  "Grow slow but strong with full focus.",
  "Use each tap to train your hands.",
  "Let your hands lead the typing game.",
  "Words typed well are wins each day.",
];

// Get a random quote from the array
function getRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// Display each character in the quote as a separate <span>
function renderQuote(text) {
  quoteEl.innerHTML = "";
  for (let ch of text) {
    const span = document.createElement("span");
    span.innerText = ch;
    quoteEl.appendChild(span);
  }
}

// Load the next quote and clear the input
async function loadNextQuote() {
  currentQuote = getRandomQuote();
  renderQuote(currentQuote);
  inputEl.value = "";
}

// Play key sound on key press
inputEl.addEventListener("keydown", (e) => {
  if (isRunning && e.key.length === 1) {
    keySound.currentTime = 0;
    keySound.play();
  }
});

// Handle user input
inputEl.addEventListener("input", async () => {
  if (!isRunning) return;

  const typed = inputEl.value;
  const spans = quoteEl.querySelectorAll("span");

  for (let i = 0; i < spans.length; i++) {
    if (typed[i] == null) {
      spans[i].style.color = "black";
    } else if (typed[i] === currentQuote[i]) {
      spans[i].style.color = "green";
    } else {
      spans[i].style.color = "red";
    }
  }

  if (typed.trim() === currentQuote.trim()) {
    const wordsInQuote = currentQuote.trim().split(/\s+/).length;
    correctWordsCount += wordsInQuote;
    await loadNextQuote();
  }
});

// Start the game
async function startGame() {
  clearInterval(timerInterval); // stop any previous timer
  isRunning = true;
  correctWordsCount = 0;
  inputEl.value = "";
  inputEl.focus();
  timerEl.innerText = "60 s";
  overlay.style.display = "none";
  resultScreen.style.display = "none";

  await loadNextQuote();

  startTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = 60 - elapsed;

    if (remaining <= 0) {
      endGame();
    } else {
      timerEl.innerText = `${remaining} s`;
    }
  }, 1000);
}

// End the game and show results
function endGame() {
  clearInterval(timerInterval);
  isRunning = false;

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const safeElapsed = Math.max(elapsedSeconds, 1);
  const wpm = Math.round(correctWordsCount / (safeElapsed / 60));

  wpmDisplay.innerText = `WPM: ${wpm}`;
  timeDisplay.innerText = `Time: ${Math.min(60, Math.round(elapsedSeconds))} s`;

  overlay.style.display = "flex";
  resultScreen.style.display = "flex";
}

// Reset the game to clean initial state
function resetGame() {
  clearInterval(timerInterval);
  isRunning = false;
  correctWordsCount = 0;
  inputEl.value = "";
  quoteEl.textContent = "Click Start to begin typing...";
  timerEl.innerText = "60 s";
  overlay.style.display = "none";
  resultScreen.style.display = "none";
}

// Button event listeners
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
tryAgainBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  resultScreen.style.display = "none";
});

// Initialize UI
resetGame();
