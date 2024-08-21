const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/*===== SHFAQJA E MENUS =====*/
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== MENUJA E FSHEHUR =====*/
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== FSHIJ MENU NE MOBIL ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // Kur klikojme ne nav__link, e fshijme show-menu klasen
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*=============== HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('header')
    // Kur scroll-i eshte me e madhe se 50 viewport height, shtojme klasen scroll-header ne tagun header
    if (this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*=============== SHOPPING LIST ===============*/
const cartBtn = document.getElementById('cart');
const shoppingList = document.getElementById('shopping-list');
const closeList = document.getElementById('close-list');

cartBtn.addEventListener('click', function () {
    shoppingList.style.right = 0;
    cartBtn.style.display = 'none';
});

closeList.addEventListener('click', function () {
    shoppingList.style.right = '-30rem';
    cartBtn.style.display = 'block';
})