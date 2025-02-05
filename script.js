const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelector('[data-testid="colorOptions"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreDisplay = document.querySelector('[data-testid="score"]');
const highScoreDisplay = document.querySelector('[data-testid="highScore"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');

let score = 0;
let highScore = 0;
let targetColor;
let newHighScoreShown = false;

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

function hexToRGB(hex) {
  hex = hex.replace("#", "");
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

function startNewGame() {
  score = 0;
  newHighScoreShown = false;
  scoreDisplay.textContent = score;
  gameStatus.textContent = "Make your first guess!";
  gameStatus.classList.remove("fade-out-status");
  nextRound();
}

function nextRound() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  colorBox.style.backgroundColor = targetColor.hex;
  renderColorOptions();
}

function renderColorOptions() {
  colorOptions.innerHTML = "";
  let shuffledColors = [...colors]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  if (!shuffledColors.some(color => color.hex === targetColor.hex)) {
    shuffledColors[Math.floor(Math.random() * 6)] = targetColor;
  }

  shuffledColors.forEach(color => {
    const button = document.createElement("button");
    button.style.backgroundColor = color.hex;
    button.setAttribute("data-testid", "colorOption");
    button.addEventListener("click", () => handleGuess(color));
    button.disabled = false;
    button.style.cursor = "pointer";
    colorOptions.appendChild(button);
  });
}

function handleGuess(guess) {
  if (guess.hex === targetColor.hex) {
    handleCorrectGuess();
  } else {
    handleWrongGuess(guess);
  }
}

function handleCorrectGuess() {
  score++;
  scoreDisplay.textContent = score;

  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
    gameStatus.textContent = newHighScoreShown ? "Correct! 🎉" : "Correct! 🎉 You hit a new high score!";
    newHighScoreShown = true;
  } else {
    gameStatus.textContent = "Correct! 🎉";
  }

  colorBox.classList.add("correct");
  setTimeout(() => colorBox.classList.remove("correct"), 500);

  gameStatus.classList.add("fade-out-status");
  setTimeout(() => {
    gameStatus.classList.remove("fade-out-status");
    gameStatus.textContent = "Make your guess!";
  }, 2000);

  nextRound();
}

function handleWrongGuess(guess) {
  const targetRGB = hexToRGB(targetColor.hex);
  const guessRGB = hexToRGB(guess.hex);
  const totalDiff = [targetRGB.r, targetRGB.g, targetRGB.b]
    .reduce((sum, val, i) => sum + Math.abs(val - Object.values(guessRGB)[i]), 0);

  const messages = [
    { threshold: 50, text: "They're almost twins!" },
    { threshold: 100, text: "They're distant cousins!" },
    { threshold: 200, text: "They're like chalk and cheese!" },
    { threshold: Infinity, text: "They're as different as night and day!" }
  ];

  const { text } = messages.find(({ threshold }) => totalDiff < threshold);
  gameStatus.textContent = `Oops! The correct color was ${targetColor.name}, but you picked ${guess.name}. ${text}`;
  gameStatus.classList.remove("fade-out-status");

  colorBox.classList.add("wrong");
  setTimeout(() => colorBox.classList.remove("wrong"), 500);

  score = 0;
  scoreDisplay.textContent = score;

  colorOptions.querySelectorAll("button").forEach(button => {
    button.disabled = true;
    button.style.cursor = "not-allowed";
  });
}

newGameButton.addEventListener("click", startNewGame);
startNewGame();
