# Gra w Okręty - Edycja Taktyczna (Tactical Edition)

Klasyczna gra w statki (Battleship), z w pełni przepisanym interfejsem graficznym, dodaną obsługą interakcji kliknięciami, oraz nowym, taktycznym, "radarowym" wyglądem z użyciem CSS Flexbox i CSS Grid. 

## 🌟 Główne Funkcje (Wersja 2.0)

*   **Nowoczesny Design (Glassmorphism):** Unowocześniony wygląd naśladujący panele dowodzenia, korzystający z neonowych akcentów oraz rozmycia tła (glassmorphism). Zastosowano czcionki *Orbitron* oraz *Inter*.
*   **Intuicyjne Sterowanie (Click-to-Fire):** Możesz wymierzyć i wystrzelić pocisk **bezpośrednio klikając na dowolne miejsce celownicze na macierzy radaru (planszy)**. Zaimplementowano także wsparcie starego, klasycznego "celowania ręcznego" poprzez pole input (np. `A0`, `B5`).
*   **W pełni Responsywna (RWD):** Elementy gry układają i skalują się dynamicznie - jest to wspierane przez w pełni zmodernizowany CSS Grid. Gra jest grywalna również na mniejszych urządzeniach mobilnych.
*   **System Postępów i Statystyk:** Terminal na górze ekranu w czasie rzeczywistym prowadzi rejestr wykorzystanych strzałów, zlicza ilość zniszczonych statków, oraz odświeża twoją "skuteczność" (%) co każdy strzał.
*   **Wizyjne Animacje i Powiadomienia (Toast):** Przestarzałe powiadomienia blokujące wbudowanej przeglądarki (`alert()`), zamienione zostały wewnątrz zgrabnego Terminala Strzeleckiego z subtelnymi animacjami. Trafienia skutkują "zadrżeniem" siatki radaru, a kropki oznaczają "pudła".

## 🚀 Instalacja i Uruchomienie

Gra działa w całości po stronie klienta (Client-Side) - nie potrzebujesz posiadać żadnego serwera backendowego czy środowiska (Node.js/Python).
Wystarczy, że:

1.  Pobierzesz/sklonujesz to środowisko.
2.  Zlokalizujesz i otworzysz główny plik `index.html` bezpośrednio w dowolnej nowoczesnej przeglądarce (Chrome, Firefox, Safari).

### Zasady gry

* Twoim zadaniem jest zatopienie całej floty wroga (3 okręty), która w sposób losowy rozstawiła się na macierzy z rozmiarami `7x7`. 
* Pamiętaj, że okręty mogą być ułożone orientacyjnie zarówno pionowo jak i poziomo (zajmują po 3 bloki każdy ułożone do siebie stykająco). Statki mogą do siebie bezpośrednio przylegać.
* Wygrywasz, gdy zatopisz je wszystkie! Zwracaj uwagę na pasek postępu aby spróbować wygrać z jak najlepszym % skuteczności i jak nabardziej zminimalizowaną ilością wykorzystanej naboju.

## 🛠 Technologie i Architektura

* **HTML5:** Wykorzystano zoptymalizowane do standardów semantyki tagi i konteneryzację elementów UI. Plansza dynamicznie nakłada komórki w JavaScript bez wymogu opierania się na manualnym tworzeniu drzewa `<table>`.
* **CSS3:** Użyto pre-definiowanych stylów Variables, Animacji liniowych po elementach rzędu (:hover, .cell.hit CSS Grid.
* **JavaScript (Vanilla):** Całkowita separacja Logiki Aplikacji (Metoda MVC - z obiektami przechowującymi model danych (`model`), aktualizację widoku (`view`) jak i pośrednictwo przy wprowadzaniu komend w wierszu sterowań (`controller`)).

--- 
*Zaprojektowano 2026. Udanych łowów dowódco.*
