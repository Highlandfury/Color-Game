const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelector('[data-testid="colorOptions"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreDisplay = document.querySelector('[data-testid="score"]');
const highScoreDisplay = document.querySelector('[data-testid="highScore"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');

let score = 0;
let highScore = 0;
let targetColor;

// Soft advanced colors based on color theory
const colors = [
  "#a8e6cf",
  "#dcedc1",
  "#ffd3b6",
  "#ffaaa5",
  "#ff8b94",
  "#c6c6c6",
  "#b5e7a0",
  "#d5e1df",
  "#e3eaa7",
  "#b5e7a0",
  "#86af49",
  "#c0d6df",
];

/*
 * Starts a completely new game (reset score)
 */
function startNewGame() {
  score = 0;
  scoreDisplay.textContent = score;
  gameStatus.textContent = "Make your guess!";
  nextRound();
}

/*
 * Prepares a new round by setting a new target color and re-rendering the options.
 * This is called after a correct guess.
 */
function nextRound() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  colorBox.style.backgroundColor = targetColor;
  renderColorOptions();
}

/*
 * Renders the color options ensuring the targetColor is always among them.
 */
function renderColorOptions() {
  colorOptions.innerHTML = "";
  // Create a copy of colors, shuffle it, and take 6 colors.
  let shuffledColors = colors
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  // Ensure the targetColor is among the options.
  if (!shuffledColors.includes(targetColor)) {
    const randomIndex = Math.floor(Math.random() * shuffledColors.length);
    shuffledColors[randomIndex] = targetColor;
  }

  shuffledColors.forEach((color) => {
    const button = document.createElement("button");
    button.style.backgroundColor = color;
    button.addEventListener("click", () => handleGuess(color));
    colorOptions.appendChild(button);
  });
}

/*
 * Handles the user's guess:
 * - On a correct guess, increments the score (and shows a new high score message if applicable) and starts a new round.
 * - On a wrong guess, resets the score but keeps the same target color so the player can try again.
 */
function handleGuess(guess) {
  if (guess === targetColor) {
    score++;
    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
      gameStatus.textContent = "Correct! 🎉 You hit a new high score!";
    } else {
      gameStatus.textContent = "Correct! 🎉";
    }
    colorBox.classList.add("correct");
    setTimeout(() => colorBox.classList.remove("correct"), 500);

    // Add fade-out effect to the game status message.
    gameStatus.classList.add("fade-out-status");
    setTimeout(() => {
      gameStatus.classList.remove("fade-out-status");
      gameStatus.textContent = "Make your guess!";
    }, 2000);

    // Start the next round
    nextRound();
  } else {
    gameStatus.textContent = "Wrong! Try again. 😢";
    colorBox.classList.add("wrong");
    setTimeout(() => colorBox.classList.remove("wrong"), 500);
    // Reset the score on a wrong guess
    score = 0;
    scoreDisplay.textContent = score;
  }
}

// Bind the new game button to restart the game.
newGameButton.addEventListener("click", startNewGame);

// Start the game for the first time.
startNewGame();
