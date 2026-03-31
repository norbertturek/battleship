// Globalne śledzenie pozycji kursora do pozycjonowania tooltipów
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

const view = {
  displayMessage(msg, isError = false, isSuccess = false) {
    const tooltip = document.getElementById('floating-tooltip');
    if (!tooltip) return;

    // Ustaw tekst
    tooltip.innerHTML = msg;
    
    // Oblicz odpowiednią pozycję:
    // Jeżeli kliknięto na komórkę, chcemy wyświetlić nad nią (cursorX, cursorY stamtąd pochodzi)
    // Ale w przypadku strzału z konsoli, może być lepiej wyśrodkować. Domyślnie używamy kursora.
    tooltip.style.left = `${cursorX}px`;
    tooltip.style.top = `${cursorY}px`;

    // Klasy błędów itp.
    if (isError) {
      tooltip.classList.add('error');
    } else {
      tooltip.classList.remove('error');
    }
    
    // Opcjonalne style dla "Zwycięstwa" lub bezpośredniego trafienia
    if (isSuccess && !isError) {
      tooltip.style.color = '#fff';
      tooltip.style.backgroundColor = 'var(--hit-color)';
      tooltip.style.borderColor = '#fff';
    } else {
      // Resetowanie do standardowego stylu powiadomień
      tooltip.style.color = '';
      tooltip.style.backgroundColor = '';
      tooltip.style.borderColor = '';
    }

    // Resetowanie animacji
    tooltip.classList.remove('show');
    void tooltip.offsetWidth; // Wymuszenie The Reflow Trick
    tooltip.classList.add('show');
  },

  displayHit(location) {
    const cell = document.getElementById(location);
    if (cell) {
      cell.setAttribute('class', 'cell hit');
    }
    this.updateStats();
  },

  displayMiss(location) {
    const cell = document.getElementById(location);
    if (cell) {
      cell.setAttribute('class', 'cell miss');
    }
    this.updateStats();
  },

  updateStats() {
    document.getElementById('stats-shots').innerText = controller.guesses;
    document.getElementById('stats-sunk').innerText = `${model.shipsSunk} / ${model.numShips}`;
    
    const accuracy = controller.guesses === 0 ? 0 : Math.round((model.shipsSunk * model.shipLength * 100) / controller.guesses);
    document.getElementById('stats-accuracy').innerText = `${accuracy}%`;
  }
};

const model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    { locations: ['0', '0', '0'], hits: ['', '', ''] },
    { locations: ['0', '0', '0'], hits: ['', '', ''] },
    { locations: ['0', '0', '0'], hits: ['', '', ''] }
  ],

  /**
   * @returns {'hit' | 'miss' | 'duplicate'}
   */
  fire(guess) {
    for (let i = 0; i < this.numShips; i++) {
       const ship = this.ships[i];
       const index = ship.locations.indexOf(guess);
       if (index === -1) continue;

       if (ship.hits[index] === 'hit') {
         view.displayMessage('Cel już trafiony.', true);
         return 'duplicate';
       }

       ship.hits[index] = 'hit';
       view.displayHit(guess);
       view.displayMessage('Trafiony!', false, true);

       if (this.isSunk(ship)) {
         view.displayMessage('Zatopiony!', false, true);
         this.shipsSunk++;
       }
       return 'hit';
    }

    view.displayMiss(guess);
    view.displayMessage('Pudło.');
    return 'miss';
  },

  isSunk(ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') return false;
    }
    return true;
  },

  generateShipLocations() {
    for (let i = 0; i < this.numShips; i++) {
       let locations;
       do {
         locations = this.generateShip();
       } while (this.collision(locations, i));
       this.ships[i].locations = locations;
       this.ships[i].hits = Array(this.shipLength).fill('');
    }
  },

  generateShip() {
    const direction = Math.floor(Math.random() * 2);
    let row;
    let col;

    if (direction === 1) { // horizontal //
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else { // vertical //
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    const newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
        if (direction === 1) {
            newShipLocations.push(`${row}${col + i}`);
        } else {
            newShipLocations.push(`${row + i}${col}`);
        }
    }
    return newShipLocations;
  },

  collision(locations, shipIndex) {
    for (let i = 0; i < shipIndex; i++) {
        const ship = this.ships[i];
        for (let j = 0; j < locations.length; j++) {
            if (ship.locations.includes(locations[j])) return true;
        }
    }
    return false;
  }
};

const controller = {
  guesses: 0,
  isGameOver: false,

  processGuess(guess) {
    if (this.isGameOver) {
      view.displayMessage('Zrestartuj grę (F5)', true);
      return;
    }

    const location = parseGuess(guess);
    if (!location) return;

    this.guesses++;
    
    const outcome = model.fire(location);
    if (outcome === 'duplicate') {
       this.guesses--; // Revert if duplicate
       return; 
    }

    if (model.shipsSunk === model.numShips) {
      this.isGameOver = true;
      view.displayMessage(`Zwycięstwo w ${this.guesses} strzałach!`, false, true);
      
      // Pokazanie panelu końcowego
      const accuracy = Math.round((model.shipsSunk * model.shipLength * 100) / this.guesses);
      document.getElementById('modal-stats-text').innerHTML = `
        Okręty wroga zniszczone.<br>
        Użyte pociski: <strong>${this.guesses}</strong><br>
        Skuteczność: <strong>${accuracy}%</strong>
      `;
      setTimeout(() => {
          document.getElementById('victory-modal').classList.add('show');
      }, 500); // 0.5s opóźnienia, żeby uzytkownik mogl zobaczyc ostatnie zatopienie
    }
    
    view.updateStats();
  }
};

function parseGuess(guess) {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (guess == null || typeof guess !== 'string' || guess.trim() === '') {
    view.displayMessage('Brak koordynatów.', true);
    return null;
  }

  // Clicks:
  if (guess.length === 2 && !isNaN(guess)) { 
      const r = parseInt(guess.charAt(0));
      const c = parseInt(guess.charAt(1));
      if(r >= 0 && r < model.boardSize && c >= 0 && c < model.boardSize) {
          return guess;
      }
  }

  // Manual:
  const trimmed = guess.trim().toUpperCase();
  if (trimmed.length !== 2) {
    view.displayMessage('Np. "A1".', true);
    return null;
  }

  const firstChar = trimmed.charAt(0);
  const row = alphabet.indexOf(firstChar);
  const column = parseInt(trimmed.charAt(1), 10);

  if (row === -1 || Number.isNaN(column)) {
    view.displayMessage('Złe koordynaty.', true);
    return null;
  }

  if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      view.displayMessage('Poza radarem!', true);
      return null;
  }

  return `${row}${column}`;
}

// GUI Generation
function createBoard() {
    const board = document.getElementById('board');
    if (!board) return;
    board.innerHTML = '';
    
    for (let r = 0; r < model.boardSize; r++) {
       for (let c = 0; c < model.boardSize; c++) {
           const cell = document.createElement('div');
           cell.className = 'cell';
           cell.id = `${r}${c}`;
           
           // Click event listener
           cell.addEventListener('click', function(e) {
              if (!controller.isGameOver) {
                  // Mimo trackingu ogólnej myszki, tu możemy przypisać dokładną pozycję kliknięcia natychmiast
                  cursorX = e.clientX; 
                  cursorY = e.clientY;
                  controller.processGuess(this.id);
              }
           });
           
           board.appendChild(cell);
       }
    }
}

function handleKeyPress(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault();
    document.getElementById('fireButton').click();
  }
}

function handleFireButton() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value;
  
  // W przypadku kliknięcia w przycisk, scentrujemy tooltip nad wpisem 
  const btnRect = document.getElementById('fireButton').getBoundingClientRect();
  cursorX = btnRect.left + (btnRect.width / 2);
  cursorY = btnRect.top;

  controller.processGuess(guess);
  guessInput.value = '';
  guessInput.focus();
}

function init() {
  createBoard();
    
  const fireButton = document.getElementById('fireButton');
  if (fireButton) fireButton.addEventListener('click', handleFireButton);

  const guessInput = document.getElementById('guessInput');
  if (guessInput) guessInput.addEventListener('keydown', handleKeyPress);
  
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) restartBtn.addEventListener('click', () => {
      // Dla najczystszego doświadczenia po prostu odświeżamy aplikację SPA
      window.location.reload();
  });

  model.generateShipLocations();
  view.updateStats();
}

window.addEventListener('DOMContentLoaded', init);
