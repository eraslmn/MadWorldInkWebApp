const collectionSwiper = document.getElementById('collection__swiper');
const collectionContent = document.querySelectorAll('.collection__content');

//Butonat
const collectionPrevBtn = document.getElementById('collectionPrevBtn');
const collectionNextBtn = document.getElementById('collectionNextBtn');

//Counter
let counterCollection = 0;
const sizeCollection = collectionContent[0].clientWidth + 16 * 2;
collectionSwiper.style.transform = `translateX(${-sizeCollection * counterCollection}px)`;


//Button Listeners
collectionNextBtn.addEventListener('click', function () {
    if (counterCollection >= collectionContent.length - 1) return;
    counterCollection++;
    collectionSwiper.style.transition = "transform 0.5s ease-in-out";
    collectionSwiper.style.transform = `translateX(${-sizeCollection * counterCollection}px)`;
});

collectionPrevBtn.addEventListener('click', function () {
    if (counterCollection <= 0) return;
    counterCollection--;
    collectionSwiper.style.transition = "transform 0.5s ease-in-out";
    collectionSwiper.style.transform = `translateX(${-sizeCollection * counterCollection}px)`;
});