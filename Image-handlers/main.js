/* Picked image elements */
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
  setTimeout(() => {
    window.history.back();
  },1000);
});


/* URL extracter */
function extractParams(){
  const urlParams = new URLSearchParams(window.location.search);
  const image = urlParams.get('image');
  const title = urlParams.get('title');
  const searchParam = urlParams.get('searchParam');
  
  
  pickedImage.src = image;
  pickedImgTitle.innerText = title;
  return { image , title , searchParam };
}


// fetching image for download 
async function fetchImage(image){
  const response = await fetch(image);
  const blob = await response.blob();
  
  const imageDownloadUrl = URL.createObjectURL(blob);
  downloadBtn.href = imageDownloadUrl;
  
  if (downloadBtn.href !== 'index.htm') {
    downloadBtn.classList.remove('disabled');
    downloadBtn.innerHTML = 'Download Image <i class="fa fa-download icon" aria-hidden="true"></i>';
  }
}


// Related image fetcher 
async function getRelatedImages(title, limit = 30) {
  const url = `https://api.unsplash.com/search/photos?query=${title}&per_page=${limit}&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo`;
  const responose = await fetch(url);
  const data = await responose.json();
  addImageElements(data);
}


/* Add image elements to each column */
function addImageElements(data) {
  columnDivs.forEach(column => {
    column.innerHTML = '';
  });
  loadMoreContainer.classList.add('disabled');

  for (let i = 0; i < data.results.length; i++) {
    const column = columnDivs[i % 3]; // select the correct column based on i

    // Creating elements 
    const relatedImageContainer = document.createElement('div');
    const relatedImageTitle = document.createElement('span');
    const relatedImage = document.createElement('img');
    const selfSearchContainer = document.createElement('div');
    const selfSearchBtn = document.createElement('button');

    // Adding data 
    relatedImageTitle.innerText = data.results[i].alt_description;
    relatedImage.src = data.results[i].urls.full;
    selfSearchBtn.innerText = "Download";

    // Adding animation until the image loads
    relatedImageContainer.classList.add('loading');

    // Removing animation when loaded 
    relatedImage.addEventListener('load', () => {
      setTimeout(() => {
        relatedImageContainer.classList.remove('loading');
      }, 1000);
    });

    // Adding classes and id
    relatedImageContainer.classList.add("related-image-container");
    relatedImageTitle.classList.add("related-image-title");
    relatedImage.id = "related-image";
    selfSearchContainer.classList.add("self-search-container");
    selfSearchBtn.classList.add("self-search-btn");

    selfSearchContainer.append(selfSearchBtn);

    relatedImageContainer.append(relatedImageTitle);
    relatedImageContainer.append(relatedImage);
    relatedImageContainer.append(selfSearchContainer);

    // Appending To each column 
    column.append(relatedImageContainer);

  }
  setTimeout(() => {
    loadMoreContainer.classList.remove('disabled');
  },1000 * 10);
}
async function getWords(query) {
  const url = `https://api.datamuse.com/words?${query}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

async function getSynonyms(title) {
  const query = `ml=${title}&max=5`;
  const words = await getWords(query);
  return words;
}


async function handleWindowLoad(){
  const { image , title , searchParam } = extractParams();
  fetchImage(image);
  
  /*let list = title.split(' ');
  let words = list[0] + ' ' + searchParam;
  const synonyms = await getSynonyms(words);
  console.log(synonyms);*/
  
  //getRelatedImages(synonyms[0].word, 5);*/
}


window.addEventListener('load',handleWindowLoad);


