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
let timerInterval;
let isRunning = false;
let correctCharCount = 0;
let timeRemaining = 60;

// Sound effect for key press
const keySound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-1124.mp3",
);

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

// Get a random quote
function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Render quote with individual spans for coloring
function renderQuote(text) {
  quoteEl.innerHTML = "";
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.innerText = char;
    quoteEl.appendChild(span);
  });
}

// Load the next quote
function loadNextQuote() {
  currentQuote = getRandomQuote();
  renderQuote(currentQuote);
  inputEl.value = "";
}

// Play key sound
inputEl.addEventListener("keydown", (e) => {
  if (isRunning && e.key.length === 1) {
    keySound.currentTime = 0;
    keySound.play().catch(() => {}); // Catch block prevents errors if browser blocks autoplay
  }
});

// Handle user input logic
inputEl.addEventListener("input", () => {
  if (!isRunning) return;

  const typed = inputEl.value;
  const spans = quoteEl.querySelectorAll("span");
  let isAllCorrect = true;

  spans.forEach((span, index) => {
    const char = typed[index];
    if (char == null) {
      span.style.color = "#6c757d"; // Muted color for untyped
      isAllCorrect = false;
    } else if (char === span.innerText) {
      span.style.color = "#28a745"; // Green for correct
    } else {
      span.style.color = "#dc3545"; // Red for incorrect
      isAllCorrect = false;
    }
  });

  // Load next quote when current one is finished correctly
  if (typed.length >= currentQuote.length && isAllCorrect) {
    correctCharCount += currentQuote.length;
    loadNextQuote();
  }
});

// Start the game logic
function startGame() {
  clearInterval(timerInterval);
  isRunning = true;
  correctCharCount = 0;
  timeRemaining = 60;

  inputEl.disabled = false;
  inputEl.value = "";
  inputEl.focus();

  timerEl.innerText = `${timeRemaining} s`;
  overlay.style.display = "none";
  resultScreen.style.display = "none";

  loadNextQuote();

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerEl.innerText = `${timeRemaining} s`;

    if (timeRemaining <= 0) {
      endGame();
    }
  }, 1000);
}

// End the game and calculate WPM
function endGame() {
  clearInterval(timerInterval);
  isRunning = false;
  inputEl.disabled = true;

  // Standard WPM formula: (Characters / 5) / (Time in minutes)
  const wpm = Math.round(correctCharCount / 5 / (60 / 60));

  wpmDisplay.innerText = `WPM: ${wpm}`;
  timeDisplay.innerText = `Time: 60 s`;

  overlay.style.display = "flex";
  resultScreen.style.display = "flex";
}

// Reset the game
function resetGame() {
  clearInterval(timerInterval);
  isRunning = false;
  correctCharCount = 0;
  inputEl.value = "";
  inputEl.disabled = false;
  quoteEl.textContent = "Click Start to begin typing...";
  timerEl.innerText = "60 s";
  overlay.style.display = "none";
  resultScreen.style.display = "none";
}

// Listeners
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
tryAgainBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", resetGame);

// Initialize
resetGame();
