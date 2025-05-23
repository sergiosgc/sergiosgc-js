# sergiosgc-js/konami-code

This listens for key stroke events on the document and fires a CustomEvent called `konamicode` whenever the famous Konami cheat code is input (⮅, ⮇, ⭠, ⭢, ⭠, ⭢, B, A).

# Usage

Register for the event on `document`:
```
document.addEventListener('konamicode', ev => console.log("Cheat mode enabled!"));
```
