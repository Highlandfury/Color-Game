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

    // Remove the fade-out effect for failed messages.
    gameStatus.classList.remove("fade-out-status");
  }
}
