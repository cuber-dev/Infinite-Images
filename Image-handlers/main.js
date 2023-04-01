const pickedImage = document.querySelector('#picked-image');
const pickedImgTitle = document.querySelector('#picked-image-title');

const backBtn = document.querySelector('#back-btn');


const urlParams = new URLSearchParams(window.location.search);
const image = urlParams.get('image');
const title = urlParams.get('title');

pickedImage.src = image;
pickedImgTitle.innerText = title;


backBtn.addEventListener('click',() => {
  window.history.back();
});