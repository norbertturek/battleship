// var loc1 = Math.floor(Math.random() * 5);
// var loc1Guess = false;
// var loc2 = loc1 + 1;
// var loc2Guess = false;
// var loc3 = loc2 + 1;
// var loc3Guess = false;
// var guess;
// var hits = 0;
// var guesses = 0;
// var isSunk = false;
// while (isSunk == false) {
//     guess = prompt("Gotów? cel, pal! (podaj liczbę z zakresu od 0-6):");
//     if (guess < 0 || guess > 6) {
//         alert("Proszę podać prawidłowy numer komórki!");
//     } else {
//         guesses = guesses + 1;
//         if (guess == loc1 || guess == loc2 || guess == loc3) {
//             alert("Trafiony!");
//             hits = hits + 1;
//             if (hits == 3) {
//                 isSunk = true;
//                 alert("Zatopiłeś mój okręt!");
//             }
//         } else {
//             alert("Pudło!");
//         }
//     }
// }
// var stats = "Potrzebowałeś " + guesses + " prób, by zatopić okręt, " +
//     "czyli Twoja efektywność wynosi: " + (3 / guesses) + ".";
// alert(stats);


// NEW VERSION OF GAME

var view = {

    displayMessage: function (msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: ['06', '16', '26'], hits: ['', '', ''] },
        { locations: ['24', '34', '44'], hits: ['', '', ''] },
        { locations: ['10', '11', '12'], hits: ['', '', ''] },
    ],
    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            // var locations = ship.locations;
            // var index = locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('Trafiony!');
                if (this.isSunk(ship)) {
                    view.displayMessage('Zatopiłeś okręt gnoju!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('Pudło!');
        return false;
    },
    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
            return true;
        }
    }
};

// view.displayMiss('00');
// view.displayHit('01');
// view.displayMessage('Co Ty kurwa chcesz od ziomka');

model.fire('15');
model.fire('00');
model.fire('44');