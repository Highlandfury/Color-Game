const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelector('[data-testid="colorOptions"]');
const scoreElement = document.querySelector('[data-testid="score"]');
const statusElement = document.querySelector('[data-testid="gameStatus"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');
const highScoreElement = document.getElementById("highScore");

let currentScore = 0;
let highScore = localStorage.getItem("colorHighScore") || 0;
let targetColor = "";
let isGameActive = true;

// Initialize high score display
highScoreElement.textContent = highScore;

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateColorOptions = () => {
  const colors = new Set();
  colors.add(generateRandomColor());

  while (colors.size < 6) {
    colors.add(generateRandomColor());
  }

  return Array.from(colors).sort(() => Math.random() - 0.5);
};

const createColorButtons = (colors) => {
  colorOptions.innerHTML = "";

  colors.forEach((color) => {
    const button = document.createElement("button");
    button.className = "color-option";
    button.style.backgroundColor = color;
    button.dataset.testid = "colorOption";
    button.addEventListener("click", () => handleGuess(color, button));
    colorOptions.appendChild(button);
  });
};

const updateHighScore = () => {
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("colorHighScore", highScore);
    highScoreElement.textContent = highScore;
  }
};

// Previous game logic remains the same, update handleGuess function:

const handleGuess = (selectedColor, button) => {
  if (!isGameActive) return;

  isGameActive = false;
  document.querySelectorAll('.color-option').forEach(btn => {
    btn.classList.add('disabled');
  });

  if (selectedColor === targetColor) {
    currentScore++;
    scoreElement.textContent = currentScore;
    statusElement.innerHTML = '🎉 Perfect Match!';
    statusElement.style.color = 'var(--correct)';
    button.classList.add('correct');
    
    // Add celebration effect
    const celebration = document.createElement('div');
    celebration.style.position = 'absolute';
    celebration.style.left = `${button.offsetLeft + button.offsetWidth/2}px`;
    celebration.style.top = `${button.offsetTop + button.offsetHeight/2}px`;
    celebration.classList.add('celebration');
    document.body.appendChild(celebration);
    
    setTimeout(() => celebration.remove(), 1000);
    
    updateHighScore();
    setTimeout(() => {
      initializeRound();
    }, 1500);
  } else {
    currentScore = 0;
    scoreElement.textContent = currentScore;
    statusElement.innerHTML = '❌ Try Again!';
    statusElement.style.color = 'var(--wrong)';
    button.classList.add('wrong');
    setTimeout(initializeRound, 1500);
  }
};

const initializeRound = () => {
  const colors = generateColorOptions();
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  colorBox.style.backgroundColor = targetColor;
  createColorButtons(colors);
  isGameActive = true;
  statusElement.textContent = "";
  document.querySelectorAll(".color-option").forEach((btn) => {
    btn.classList.remove("disabled", "correct", "wrong");
  });
};

newGameButton.addEventListener("click", () => {
  currentScore = 0;
  scoreElement.textContent = currentScore;
  initializeRound();
});

// Start game
initializeRound();
