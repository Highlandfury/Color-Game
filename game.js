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
