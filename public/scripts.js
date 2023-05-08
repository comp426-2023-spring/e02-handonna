document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    const gameResult = document.getElementById('game-result');
    const resultText = document.getElementById('result-text');
    
    playButton.addEventListener('click', async () => {
      const gameType = document.querySelector('input[name="game"]:checked').value;
      const move = document.querySelector(`input[name="${gameType === 'rps' ? 'rps-move' : 'rpsls-move'}"]:checked`).value;
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
  });

  
  document.getElementById('rules-button').addEventListener('click', () => {
      const rulesSection = document.getElementById('rules');
      if (rulesSection.style.display === 'none') {
          rulesSection.style.display = 'block';
      } else {
          rulesSection.style.display = 'none';
      }
  });
