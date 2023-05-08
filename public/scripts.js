document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('play-button');
  const gameResult = document.getElementById('game-result');
  const resultText = document.getElementById('result-text');
  const resetButton = document.getElementById('reset-button');
  const rulesButton = document.getElementById('rules-button');
  const opponentYes = document.getElementById('opponent-yes');
  const opponentNo = document.getElementById('opponent-no');
  const moveSelection = document.getElementById('move-selection');
  const gameRules = document.getElementById('game-rules');

  function updateMoveSelectionState() {
    if (opponentNo.checked) {
      moveSelection.style.display = 'none';
    } else {
      moveSelection.style.display = 'block';
    }
  }

  opponentYes.addEventListener('change', updateMoveSelectionState);
  opponentNo.addEventListener('change', updateMoveSelectionState);

  updateMoveSelectionState();

  playButton.addEventListener('click', async () => {
    const gameType = document.querySelector('input[name="game"]:checked').value;
    const moveOptions = gameType === 'rps' ? ['rock', 'paper', 'scissors'] : ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    let move;

    if (opponentNo.checked) {
      const randomIndex = Math.floor(Math.random() * moveOptions.length);
      move = moveOptions[randomIndex];
    } else {
      move = document.querySelector(`input[name="${gameType === 'rps' ? 'rps-move' : 'rpsls-move'}"]:checked`).value;
    }

    const url = `/app/${gameType}/play`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ move }),
    });
    const result = await response.json();

    gameResult.style.display = 'block';
    resultText.innerHTML = `Player chose ${result.player}, Opponent chose ${result.opponent}, Result is ${result.result}.`;
  });

  resetButton.addEventListener('click', () => {
    document.querySelectorAll('input[type=radio]').forEach((input) => {
      if (input.defaultChecked) {
        input.checked = true;
      }
    });

    gameResult.style.display = 'none';
  });

  rulesButton.addEventListener('click', () => {
    if (gameRules.style.display === 'none') {
      gameRules.style.display = 'block';
    } else {
      gameRules.style.display = 'none';
    }
  });
});

