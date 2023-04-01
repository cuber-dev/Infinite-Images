/* Form elements */
const form = document.querySelector('form');
const searchInput = document.querySelector('#photo-search-input');
const submitBtn = document.querySelector('#submit');

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




/* Debounce */
function debounceTimeout(makeRequest ,delay = 1000){
  let timeOut;
  return async (photoName) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      await makeRequest(photoName);
    }, delay);
  }
}
const debounceRequest = debounceTimeout(makeRequest,1500);

/* Making api request */
async function makeRequest(photoName) {
  const url = 'https://api.unsplash.com/search/photos?query='+ photoName +'&per_page=30&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo';
  const responose = await fetch(url);
  const data = await responose.json();
  console.log(data);
}

/* Listening for input or submit */
form.addEventListener('submit',async (e) => {
  e.preventDefault();
  await debounceRequest(searchInput.value);
})
searchInput.addEventListener('input',async () => {
  await debounceRequest(searchInput.value);
});
