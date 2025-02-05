const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelector('[data-testid="colorOptions"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreDisplay = document.querySelector('[data-testid="score"]');
const highScoreDisplay = document.querySelector('[data-testid="highScore"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');

let score = 0;
let highScore = 0;
let targetColor;

// Flag to ensure the "new high score" message shows only once per game
let newHighScoreShown = false;

// An array of color objects with hex codes and descriptive names.
const colors = [
  { hex: "#a8e6cf", name: "Minty Green" },
  { hex: "#dcedc1", name: "Pastel Green" },
  { hex: "#ffd3b6", name: "Peach" },
  { hex: "#ffaaa5", name: "Salmon" },
  { hex: "#ff8b94", name: "Coral Pink" },
  { hex: "#c6c6c6", name: "Silver" },
  { hex: "#b5e7a0", name: "Sage" },
  { hex: "#d5e1df", name: "Pale Blue" },
  { hex: "#e3eaa7", name: "Lime" },
  { hex: "#86af49", name: "Olive" },
  { hex: "#c0d6df", name: "Sky Blue" },
];

/*
 * Converts a hex color string to an object with r, g, b values.
 */
function hexToRGB(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

/*
 * Starts a completely new game (resets score and re-enables buttons).
 */
function startNewGame() {
  score = 0;
  newHighScoreShown = false; // Reset flag for new game
  scoreDisplay.textContent = score;
  gameStatus.textContent = "Make your guess!";
  nextRound();
}

/*
 * Prepares a new round by setting a new target color and re-rendering the options.
 */
function nextRound() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  colorBox.style.backgroundColor = targetColor.hex;
  renderColorOptions();
}

/*
 * Renders the color options ensuring the targetColor is always among them.
 */
function renderColorOptions() {
  colorOptions.innerHTML = "";
  // Create a shuffled copy of the colors array and take 6 options.
  let shuffledColors = colors
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  // Ensure the targetColor is among the options.
  if (!shuffledColors.find((color) => color.hex === targetColor.hex)) {
    const randomIndex = Math.floor(Math.random() * shuffledColors.length);
    shuffledColors[randomIndex] = targetColor;
  }

  // Create and append buttons for each color.
  shuffledColors.forEach((color) => {
    const button = document.createElement("button");
    button.style.backgroundColor = color.hex;
    button.addEventListener("click", () => handleGuess(color));
    // Ensure the button is enabled (useful after a failed round)
    button.disabled = false;
    button.style.cursor = "pointer";
    colorOptions.appendChild(button);
  });
}

/*
 * Handles the user's guess.
 */
function handleGuess(guess) {
  if (guess.hex === targetColor.hex) {
    // Correct guess branch.
    score++;
    scoreDisplay.textContent = score;

    // If the current score beats the previous high score.
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
      if (!newHighScoreShown) {
        gameStatus.textContent = "Correct! 🎉 You hit a new high score!";
        newHighScoreShown = true;
      } else {
        gameStatus.textContent = "Correct! 🎉";
      }
    } else {
      gameStatus.textContent = "Correct! 🎉";
    }

    colorBox.classList.add("correct");
    setTimeout(() => colorBox.classList.remove("correct"), 500);

    // For correct guesses, use a fade-out effect on the status message.
    gameStatus.classList.add("fade-out-status");
    setTimeout(() => {
      gameStatus.classList.remove("fade-out-status");
      gameStatus.textContent = "Make your guess!";
    }, 2000);

    // Start the next round.
    nextRound();
  } else {
    // Wrong guess branch.

    // Convert hex colors to RGB to compare differences.
    const targetRGB = hexToRGB(targetColor.hex);
    const guessRGB = hexToRGB(guess.hex);
    const diffR = Math.abs(targetRGB.r - guessRGB.r);
    const diffG = Math.abs(targetRGB.g - guessRGB.g);
    const diffB = Math.abs(targetRGB.b - guessRGB.b);
    const totalDiff = diffR + diffG + diffB;

    // Choose a humorous, educational message based on the total difference.
    let funnyLine;
    if (totalDiff < 50) {
      funnyLine = "They're almost twins!";
    } else if (totalDiff < 100) {
      funnyLine = "They're distant cousins!";
    } else if (totalDiff < 200) {
      funnyLine = "They're like chalk and cheese!";
    } else {
      funnyLine = "They're as different as night and day!";
    }

    // Update the game status with the educational funny line using the color names.
    // The message stays until the New Game button is clicked.
    gameStatus.textContent = `Oops, you failed! The correct color was ${targetColor.name}, but you picked ${guess.name}. ${funnyLine}`;

    // Add a brief animation for feedback.
    colorBox.classList.add("wrong");
    setTimeout(() => colorBox.classList.remove("wrong"), 500);

    // Reset the score on a wrong guess.
    score = 0;
    scoreDisplay.textContent = score;

    // Disable all color-option buttons so that the only clickable button is "New Game".
    const buttons = colorOptions.querySelectorAll("button");
    buttons.forEach((button) => {
      button.disabled = true;
      button.style.cursor = "not-allowed";
    });
  }
}

// Bind the new game button to restart the game.
newGameButton.addEventListener("click", startNewGame);

// Start the game for the first time.
startNewGame();
