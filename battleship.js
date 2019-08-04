var loc1 = 3;
var loc2 = 4;
var loc3 = 5;
var guess;
var hits = 0;
var guesses = 0;
var isSunk = false;
while (isSunk == false) {
    guess = prompt("Gotów? cel, pal! (podaj liczbę z zakresu od 0-6):");
    if (guess < 0 || guess > 6) {
        alert("Proszę podać prawidłowy numer komórki!");
    } else {
        guesses = guesses + 1;
        if (guess == loc1 || guess == loc2 || guess == loc3) {
            alert("Trafiony!");
            hits = hits + 1;
            if (hits == 3) {
                isSunk = true;
                alert("Zatopiłeś mój okręt!");
            }
        } else {
            alert("Pudło!");
        }
    }
}
var stats = "Potrzebowałeś " + guesses + " prób, by zatopić okręt, " +
    "czyli Twoja efektywność wynosi: " + (3 / guesses) + ".";
alert(stats);