const logRegSwiper = document.getElementById('log-reg__swiper');
const logRegContent = document.querySelectorAll('.log-reg__content');

const logIn = document.getElementById('login');
const signUp = document.getElementById('signup');

//Butonat
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loginBtn = document.getElementById('login-btn');
const sgnUpBtn = document.getElementById('sgnup-btn');

let counter = localStorage.getItem("Counter");
const size = logRegContent[0].clientWidth;
logRegSwiper.style.transform = `translateX(${-size * counter}px)`;

loginBtn.addEventListener('click', function () {
    localStorage.setItem("Counter", "0");
})
sgnUpBtn.addEventListener('click', function () {
    localStorage.setItem("Counter", "1");
})
if (localStorage.getItem("Counter") == 0) {
    logIn.style.top = 0;
    signUp.style.top = '-4rem';
}
if (localStorage.getItem("Counter") == 1) {
    logIn.style.top = '-4rem';
    signUp.style.top = 0;
}

//Button Listeners
nextBtn.addEventListener('click', function () {
    if (counter >= logRegContent.length - 1) return;
    counter++;
    logIn.style.top = '-4rem';
    signUp.style.top = 0;
    logRegSwiper.style.transition = "transform 0.4s ease";
    logRegSwiper.style.transform = `translateX(${-size * counter}px)`;
});

prevBtn.addEventListener('click', function () {
    if (counter <= 0) return;
    counter--;
    logIn.style.top = 0;
    signUp.style.top = '-4rem';
    logRegSwiper.style.transition = "transform 0.4s ease";
    logRegSwiper.style.transform = `translateX(${-size * counter}px)`;
});