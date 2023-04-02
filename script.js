/* Form elements */
const form = document.querySelector('form');
const searchInput = document.querySelector('#photo-search-input');
const submitBtn = document.querySelector('#submit');

/* Image elements */
const wholeImgContainer = document.querySelector('.whole-img-container');
const columnDivs = Array.from(document.querySelectorAll('.column-div'));

/* load more elements */
const loadMoreContainer = document.querySelector('.load-more-container');
const loadMoreBtn = document.querySelector('#load-more');

// Global variables 
let nextPage = 0;
let holdValue = '';
let globalImageName = '';

/* ================= Placeholders =================================*/
let strings = 'cute-cats Artwork-#1 Demo-Picture AI-Art Galaxy-images Wonderfull-Nature Animals-and-Birds Fashion-pictures HD-wallpapers 3D-art';
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
    currentStringIndex = Math.floor(Math.random() * words.length);
    setTimeout(changeWord,1000 * 10);
  }
}
function changeWord(){
  searchInput.placeholder = '';
  typeNextCharacter();
}

changeWord();
/* ============================================= */





/* Making api request */
async function getImages(photoName, limit = 30) {

  const url = `https://api.pexels.com/v1/search?query=${photoName}&per_page=${limit}&page=${nextPage++}`;
  const response = await fetch(url, {
    headers: {
      Authorization: 'jhaRNPVlrpGVp8JO2GP3GBChuVMnOc6cL0W5ci780jSRjf35hKgEq2O3',
    },
  });
  const data = await response.json();
  
  loadMoreContainer.classList.add('disabled');
  
  addImageElements(data);
}


/* Add image elements to each column */
function addImageElements(data){
  
  for(let i = 0; i < data.photos.length; i++){
    const column = columnDivs[i % 3]; // select the correct column based on i

    // Creating elements 
    const imageContainer = document.createElement('div');
    const imageTitle = document.createElement('span');
    const image = document.createElement('img');
    const popUpWindowContainer = document.createElement('div');
    const popUpWindowBtn = document.createElement('button');
     
    // Adding data 
    imageTitle.innerText = data.photos[i].alt;
    image.src = data.photos[i].src.large;
    popUpWindowBtn.innerText = "Download";
    
    // Adding animation until the image loads
    imageContainer.classList.add('loading');
    
    // Removing animation when loaded 
    image.addEventListener('load',() => {
      setTimeout(() => {
        imageContainer.classList.remove('loading');
      },1000);
    });
    
    // Adding classes
    imageContainer.classList.add("image-container");
    imageTitle.classList.add("image-title");
    image.classList.add('image');
    popUpWindowContainer.classList.add("redirector-container");
    popUpWindowBtn.classList.add("redirector-btn");
     
    // Appending elements to imageContainer
    popUpWindowContainer.append(popUpWindowBtn);
     
    imageContainer.append(imageTitle);
    imageContainer.append(image);
    imageContainer.append(popUpWindowContainer);
     
    // Appending To each column 
    column.append(imageContainer);    
    
  }
  
  wholeImgContainer.classList.remove('loading');

  setTimeout(() => {
    loadMoreContainer.classList.remove('disabled');
  },1000 * 8);
}

async function handleFormSubmit(e){
  e.preventDefault();
  
  if (searchInput.value.trim() === holdValue) {
    return;
  } else {
  
    wholeImgContainer.classList.add('loading');
  
    columnDivs.forEach(column => {
      column.innerHTML = '';
    });
  
    await getImages(searchInput.value.trim(), 30);
    
    holdValue = searchInput.value.trim();
    globalImageName = holdValue;
  }
}
form.addEventListener('submit',async (e) => {handleFormSubmit(e)});


async function handleImageClick(e){
  const children = e.target;
  if (children.matches('.redirector-btn')) {
  
    let image = children.parentElement.previousElementSibling.src;
    let title = children.parentElement.previousElementSibling.previousElementSibling.innerText;
    // window.location.href = 'https://cuber-dev.github.io/Infinite-Images/Image-handlers/preview.html?image=' + encodeURI(image) + '&title=' + encodeURI(title) + '&searchParam=' + encodeURI(searchInput.value.trim());
  
    window.location.href = '/Image-handlers/preview.html?image=' + encodeURI(image) + '&title=' + encodeURI(title) + '&searchParam=' + encodeURI(searchInput.value.trim());
  
  }
}
wholeImgContainer.addEventListener('click',(e) => {handleImageClick(e)});


loadMoreBtn.addEventListener('click',async () => {
  await getImages(globalImageName,10);
  loadMoreContainer.classList.add('loading');

  setTimeout(() => {
    loadMoreContainer.classList.remove('loading');
  },1000 * 8);
});