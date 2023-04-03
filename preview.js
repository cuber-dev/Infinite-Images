/* Picked image elements */
const imageContainer = document.querySelector('.image-container');
const pickedImgTitle = document.querySelector('#picked-image-title');
const pickedImage = document.querySelector('#picked-image');
const downloadBtn = document.querySelector('#download-btn');

/* Related images grid elements */
const relatedImagesGrid = document.querySelector('.related-images-grid');
const columnDivs = document.querySelectorAll('.column-div');

/* Self search button */
const selfSearchBtn = document.querySelector('.self-search-btn');

/* Load more container */
const loadMoreContainer = document.querySelector('.load-more-container');

/* Back button */
const backBtn = document.querySelector('#back-btn');
backBtn.addEventListener('click', () => {
  backBtn.classList.add('clicked');
  setTimeout(() => {
    window.history.back();
  },300);
});

/* Go-to top button */
const gotoTopBtn = document.querySelector('#goto-top-btn');



// Global variables 
let nextPage = 0;
let globalImageName = '';





/* URL extracter */
function extractParams(){
  imageContainer.classList.add('buffer');

  const urlParams = new URLSearchParams(window.location.search);
  const image = urlParams.get('image');
  const title = urlParams.get('title');
  const searchParam = urlParams.get('searchParam');
  
  pickedImage.src = image;
  pickedImgTitle.innerText = title;
  
  pickedImage.addEventListener('load',() => {
   imageContainer.classList.remove('buffer');
  });
  
  return { image , title , searchParam };
}


// fetching image for download 
async function fetchImage(image){
  downloadBtn.classList.add('disabled');

  const response = await fetch(image);
  const blob = await response.blob();

  const imageDownloadUrl = URL.createObjectURL(blob);
  downloadBtn.href = imageDownloadUrl;
  
  if (downloadBtn.href !== 'index.htm' && downloadBtn.href !== '' && image !== null) {
    downloadBtn.classList.remove('disabled');
    downloadBtn.innerHTML = 'Download Image <i class="fa fa-download icon" aria-hidden="true"></i>';
  }
}

// Related image fetcher 
async function getRelatedImages(title, limit) {
  loadMoreContainer.classList.add('disabled');
  
  const url = `https://api.pexels.com/v1/search?query=${title}&per_page=${limit}&page=${nextPage++}`;
  const response = await fetch(url, {
    headers: {
      Authorization: 'jhaRNPVlrpGVp8JO2GP3GBChuVMnOc6cL0W5ci780jSRjf35hKgEq2O3',
    },
  });
  const data = await response.json();
  
  addImageElements(data);
}


/* Add image elements to each column */
function addImageElements(data) {
  
  for (let i = 0; i < data.photos.length; i++) {
    const column = columnDivs[i % 3]; // select the correct column based on i
    
    // Creating elements 
    const relatedImageContainer = document.createElement('div');
    const relatedImageTitle = document.createElement('span');
    const relatedImage = document.createElement('img');
    const selfSearchContainer = document.createElement('div');
    const selfSearchBtn = document.createElement('button');

    // Adding data 
    relatedImageTitle.innerText = data.photos[i].alt;
    relatedImage.src = data.photos[i].src.large;
    selfSearchBtn.innerText = "Download";

    // Adding animation until the image loads
    relatedImageContainer.classList.add('loading');

    // Removing animation when loaded 
    relatedImage.addEventListener('load', () => {
      setTimeout(() => {
        relatedImageContainer.classList.remove('loading');
      }, 1000);
    });

    // Adding classes 
    relatedImageContainer.classList.add("related-image-container","image-container");
    relatedImageTitle.classList.add("related-image-title","image-title");
    relatedImage.classList.add("related-image","image");
    selfSearchContainer.classList.add("self-search-container","redirector-container");
    selfSearchBtn.classList.add("self-search-btn","redirector-btn");

    selfSearchContainer.append(selfSearchBtn);

    relatedImageContainer.append(relatedImageTitle);
    relatedImageContainer.append(relatedImage);
    relatedImageContainer.append(selfSearchContainer);

    // Appending To each column 
    column.append(relatedImageContainer);

    relatedImagesGrid.classList.remove('loading');

  }
  setTimeout(() => {
    loadMoreContainer.classList.remove('disabled');
  },1000 * 8);
}


async function handleWindowLoad(){
  const { image , title , searchParam } = extractParams();
  fetchImage(image);
  
  getRelatedImages(title,20);
  globalImageName = title;
}
window.addEventListener('load',handleWindowLoad);


function handleSelfClick(e){
  const children = e.target;
  if (children.matches('.self-search-btn')) {
    let image = children.parentElement.previousElementSibling.src;
    let title = children.parentElement.previousElementSibling.previousElementSibling.innerText;
  
    pickedImgTitle.innerText = title;
    pickedImage.src = image;
  
    downloadBtn.innerHTML = 'Loading...';
    setTimeout(() => {
      columnDivs.forEach(column => {
        column.innerHTML = '';
      });
    },500);

    relatedImagesGrid.classList.add('loading');

    fetchImage(image);
    getRelatedImages(title,20);
    globalImageName = title;

    gotoTopBtn.click()
  }
}
relatedImagesGrid.addEventListener('click',(e) => {
  handleSelfClick(e);
});


// loadMoreBtn.addEventListener('click',async () => {
//   await getRelatedImages(globalImageName,15);
//   loadMoreContainer.classList.add('loading');
  
//   setTimeout(() => {
//     loadMoreContainer.classList.remove('loading');
//   }, 1000 * 8);
// });
