/* Form elements */
const form = document.querySelector('form');
const searchInput = document.querySelector('#photo-search-input');
const submitBtn = document.querySelector('#submit');

/* Image elements */
const imageGrid = document.querySelector('.image-grid');
const columnDivs = Array.from(document.querySelectorAll('.column-div'));

/* load more */
const loadMoreContainer = document.querySelector('.load-more-container');

const gotoTopBtn = document.querySelector('.goto-top-btn');





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

const observer = new IntersectionObserver(async entries => {
  const lastChild = entries[0];
  
  if(!lastChild.isIntersecting) return;
  
  await addImageElementsByScroll();
  
}, {
  rootMargin : '100px'
});



/* Making api request */
async function getImages(photoName = globalImageName, limit = 30) {
  const url = `https://api.pexels.com/v1/search?query=${photoName}&per_page=${limit}&page=${nextPage++}`;
  const response = await fetch(url, {
    headers: {
      Authorization: 'jhaRNPVlrpGVp8JO2GP3GBChuVMnOc6cL0W5ci780jSRjf35hKgEq2O3',
    }
  });
  const data = await response.json();
  
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
    const redirectorContainer = document.createElement('div');
    const redirectorBtn = document.createElement('button');
     
    // Adding data 
    imageTitle.innerText = data.photos[i].alt;
    image.src = data.photos[i].src.large;
    redirectorBtn.innerText = "Download";
    
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
    redirectorContainer.classList.add("redirector-container");
    redirectorBtn.classList.add("redirector-btn");
     
    // Appending elements to imageContainer
    redirectorContainer.append(redirectorBtn);
     
    imageContainer.append(imageTitle);
    imageContainer.append(image);
    imageContainer.append(redirectorContainer);
     
    // Appending To each column 
    column.append(imageContainer);    
    
  }
  
  imageGrid.classList.remove('loading');

  observer.observe(loadMoreContainer);
}

async function handleFormSubmit(e){
  e.preventDefault();
  
  if (searchInput.value.trim() === holdValue) {
    return;
  } else {
  
    observer.observe(loadMoreContainer);

    imageGrid.classList.add('loading');
  
    columnDivs.forEach(column => {
      column.innerHTML = '';
    });
    
    nextPage = 0;
    
    setTimeout( async () => {
      if(columnDivs[2].innerHTML === '') await getImages(searchInput.value.trim(), 15);
      else submitBtn.click();
     },3000);
    
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
  
    window.location.href = 'preview.html?image=' + encodeURI(image) + '&title=' + encodeURI(title) + '&searchParam=' + encodeURI(searchInput.value.trim());
  
  }
}
imageGrid.addEventListener('click',(e) => {handleImageClick(e)});








/* Scroll to top */

function gotoTopBtnShow(){
    if(window.pageYOffset > 100) gotoTopBtn.classList.add('show');
    else gotoTopBtn.classList.remove('show');
}
window.addEventListener('scroll',gotoTopBtnShow);




// Elements added by scorll

/* load more */
async function addImageElementsByScroll() {
    try{
      await getImages();

      loadMoreContainer.classList.add('loading');
      
      setTimeout(() => {
        loadMoreContainer.classList.remove('loading');
      }, 1000 * 8);
    }catch(e){
    console.log(e);
      loadMoreContainer.classList.remove('loading');
      loadMoreContainer.innerText = 'Reached the End';
    }
  }












