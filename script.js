const searchInput = document.querySelector('#photo-search-input');

/* Placeholders */
let strings = 'Picture-X Artwork-#1 Sample-Image Demo-Picture AI-Art';
let words = strings.split(' ');
let currentStringIndex = 0;
let currentCharacterIndex = 0;
let timeoutId;

function typeNextCharacter() {
  if (currentCharacterIndex < words[currentStringIndex].length){
    let currentText = searchInput.placeholder;
    let nextChar = words[currentStringIndex].charAt(currentCharacterIndex);
    searchInput.placeholder = currentText + nextChar;
    currentCharacterIndex++;
    timeoutId = setTimeout(typeNextCharacter,200);
  }else{
    clearTimeout(timeoutId);
    currentCharacterIndex = 0;
    currentStringIndex = (currentStringIndex + 1) < words.length ? currentStringIndex + 1 : 0;
    setTimeout(changeWord,1000 * 5);
  }
}
function changeWord(){
  searchInput.placeholder = '';
  typeNextCharacter();
}

changeWord();
/* ============================================= */