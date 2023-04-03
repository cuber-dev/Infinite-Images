
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

const gotoTopBtn = document.querySelector('.goto-top-btn');


/* Back button */
const backBtn = document.querySelector('#back-btn');
backBtn.addEventListener('click', () => {
  backBtn.classList.add('clicked');
  setTimeout(() => {
    window.history.back();
  },300);
});


// Global variables 
let nextPage = 0;
let globalImageTitle = '';

// Observer for adding more images by scolll

const observer = new IntersectionObserver(async entries => {
  const lastChild = entries[0];
  
  if(!lastChild.isIntersecting) return;
  
  await addImageElementsByScroll();
  
}, {
  rootMargin : '100px'
});



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
async function getRelatedImages(title = globalImageTitle, limit = 15) {
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
    if (window.innerWidth < 550) { // check if screen width is less than 768px (mobile size)
      column = columnDivs[0]; // select the first column
    } else {
      column = columnDivs[i % 3]; // select the correct column based on i
    }
    
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
  observer.observe(loadMoreContainer);
}

// Handle windwow load 
async function handleWindowLoad(){
  const { image , title , searchParam } = extractParams();
  fetchImage(image);
  
  getRelatedImages(title,20);
  globalImageTitle = title;
}
window.addEventListener('load',handleWindowLoad);

// Handle self donwload clicks
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
    observer.observe(loadMoreContainer);

    fetchImage(image);
    getRelatedImages(title,20);
    globalImageTitle = title;

    gotoTopBtn.click()
  }
}
relatedImagesGrid.addEventListener('click',(e) => {
  handleSelfClick(e);
});

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
      await getRelatedImages();

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