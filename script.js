/* Form elements */
const form = document.querySelector('form');
const searchInput = document.querySelector('#photo-search-input');
const submitBtn = document.querySelector('#submit');

/* Image elements */
const wholeImgContainer = document.querySelector('.whole-img-container');
const columnDivs = Array.from(document.querySelectorAll('.column-div'));

/* load more elements */
const loadMoreContainer = document.querySelector('.load-more-container');
const loadMoreBtn = document.querySelector('.load-more');

/* window elements */
/*
const windowOuterContainer = document.querySelector('.window-outer-container');
const windowInnerContainer = document.querySelector('.window-inner-container');
const windowHeaderContainer = document.querySelector('.window-header-container');
const windowBackBtn = document.querySelector('#back-btn');
const windowDownloadContainer = document.querySelector('.window-donwload-container');
const WindowImageTitle = document.querySelector('#window-image-title');
const windowImage = document.querySelector('#window-image');
const windowDownloadBtn = document.querySelector('#window-download-btn');
*/


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




/* ================== Debounce ======================*/
function debounceTimeout(getImages ,delay = 1000){
  let timeOut;
  return async (photoName,limit) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      await getImages(photoName,limit);
    }, delay);
  }
}
const debounceRequest = debounceTimeout(getImages,1500);

/* Making api request */
async function getImages(photoName,limit = 30) {
  const url = `https://api.unsplash.com/search/photos?query=${photoName}&per_page=${limit}&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo`;
  const responose = await fetch(url);
  const data = await responose.json();
  console.log(data);
  addImageElements(data);
}


/* Add image elements to each column */
function addImageElements(data){
  columnDivs.forEach(column => {
    column.innerHTML = '';
  });
  loadMoreContainer.classList.add('disabled');
  
  for(let i = 0; i < data.results.length; i++){
    const column = columnDivs[i % 3]; // select the correct column based on i

    // Creating elements 
    const imageContainer = document.createElement('div');
    const imageTitle = document.createElement('span');
    const image = document.createElement('img');
    const popUpWindowContainer = document.createElement('div');
    const popUpWindowBtn = document.createElement('button');
     
    // Adding data 
    imageTitle.innerText = data.results[i].alt_description;
    image.src = data.results[i].urls.regular;
    popUpWindowBtn.innerText = "Download";
    
    // Adding animation until the image loads
    imageContainer.classList.add('loading');
    
    // Removing animation when loaded 
    image.addEventListener('load',() => {
      setTimeout(() => {
        imageContainer.classList.remove('loading');
      },1000);
    });
    
    // Adding classes and id
    imageContainer.classList.add("image-container");
    imageTitle.classList.add("image-title");
    image.id = "image";
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
  setTimeout(() => {
    loadMoreContainer.classList.remove('disabled');
  },1000 * 10);
}

let holdValue = '';

/* Listening for input or submit */
form.addEventListener('submit',async (e) => {
  e.preventDefault();
  
  if(searchInput.value.trim() === holdValue){
    return; 
  }else{
    await debounceRequest(searchInput.value.trim(),30);
    holdValue = searchInput.value.trim();
  }
});
/*
function handleWindow(image,imageTitle){
  windowOuterContainer.classList.remove('disabled');
  WindowImageTitle.innerText = imageTitle.innerText;
  windowImage.src = image.src;
  
  windowDownloadBtn.classList.add('disabled');

  windowDownloadBtn.href = '';
  
  fetchImage(windowImage.src);
  
  if(windowDownloadBtn.href !== 'index.htm'){
    windowDownloadBtn.classList.remove('disabled');
  }
}

async function fetchImage(image){
  const response = await fetch(image);
  const blob = await response.blob();
  
  const imageDownloadUrl = URL.createObjectURL(blob);
  windowDownloadBtn.href = imageDownloadUrl;
}*/


wholeImgContainer.addEventListener('click',(e) => {
  const children = e.target;
  if(children.matches('.redirector-btn')){
    //handleWindow(children.parentElement.previousElementSibling,children.parentElement.previousElementSibling.previousElementSibling);
    
    let image = children.parentElement.previousElementSibling.src;
    let title = children.parentElement.previousElementSibling.previousElementSibling.innerText;
    window.location.href = '/Image-handlers/preview.html?image=' + encodeURI(image) + '&title=' + encodeURI(title) + '&searchParam=' + encodeURI(searchInput.value.trim());

  }
});
/*
windowBackBtn.addEventListener('click',() => { 
  windowOuterContainer.classList.add('disabled');
});*/

