/* Scroll to top */
const gotoTopBtn = document.querySelector('.goto-top-btn');

function gotoTopBtnShow(){
    if(window.pageYOffset > 100) gotoTopBtn.classList.add('show');
    else gotoTopBtn.classList.remove('show');
}
window.addEventListener('scroll',gotoTopBtnShow);