/* Picked image elements */
const pickedImgTitle = document.querySelector('#picked-image-title');
const pickedImage = document.querySelector('#picked-image');
const downloadBtn = document.querySelector('#download-btn');

/* Related images grid elements */
const relatedImagesGrid = document.querySelector('.related-images-grid');
const columnDivs = document.querySelectorAll('.column-div');

/* Self search button */
const selfSearchBtn = document.querySelector('.self-search-btn');


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
  
  pickedImage.src = image;
  pickedImgTitle.innerText = title;
}
window.addEventListener('load',extractParams);


