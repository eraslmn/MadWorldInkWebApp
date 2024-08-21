let size;

const homeSwiper = document.getElementById('home__swiper');
const homeContent = document.querySelectorAll('.home__content');

//Butonat
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

//Counter
let counter = 1;
function myFunction(x) {
    if (maxWidth1300.matches) {
        size = homeContent[0].clientWidth;
        homeSwiper.style.transition = "transform 0s ease-in-out";
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
    else if (maxWidth1000.matches) {
        size = homeContent[0].clientWidth;
        homeSwiper.style.transition = "transform 0s ease-in-out";
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
    else if (maxWidth800.matches) {
        size = homeContent[0].clientWidth;
        homeSwiper.style.transition = "transform 0s ease-in-out";
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
    else if (maxWidth595.matches) {
        size = homeContent[0].clientWidth;
        homeSwiper.style.transition = "transform 0s ease-in-out";
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
    else {
        size = homeContent[0].clientWidth;
        homeSwiper.style.transition = "transform 0s ease-in-out";
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
}

//Button Listeners
nextBtn.addEventListener('click', function () {
    if (counter >= homeContent.length - 1) return;
    counter++;
    homeSwiper.style.transition = "transform 0.5s ease-in-out";
    homeSwiper.style.transform = `translateX(${-size * counter}px)`;
});

prevBtn.addEventListener('click', function () {
    if (counter <= 0) return;
    counter--;
    homeSwiper.style.transition = "transform 0.5s ease-in-out";
    homeSwiper.style.transform = `translateX(${-size * counter}px)`;
});

homeSwiper.addEventListener('transitionend', function () {
    if (homeContent[counter].id === 'lastClone') {
        homeSwiper.style.transition = "none";
        counter = homeContent.length - 2;
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
    if (homeContent[counter].id === 'firstClone') {
        homeSwiper.style.transition = "none";
        counter = homeContent.length - counter;
        homeSwiper.style.transform = `translateX(${-size * counter}px)`;
    }
})

let maxWidth1300 = window.matchMedia("(max-width: 1300px)");
let maxWidth1000 = window.matchMedia("(max-width: 1000px)");
let maxWidth800 = window.matchMedia("(max-width: 800px)");
let maxWidth595 = window.matchMedia("(max-width: 595px)");
myFunction(maxWidth1300);
myFunction(maxWidth1000);
myFunction(maxWidth800);
myFunction(maxWidth595);
maxWidth1300.addListener(myFunction);
maxWidth1000.addListener(myFunction);
maxWidth800.addListener(myFunction);
maxWidth595.addListener(myFunction);