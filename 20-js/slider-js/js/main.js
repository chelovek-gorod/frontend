'use strict'

/*****************************
 * 
 *  MOBILE MENU
 * 
 */

const mobileMenuPopup = document.getElementById('mainMenuNav');
document.getElementById('mobileMenu').onclick =  showPopUpMenu;

mobileMenuPopup.addEventListener('click', function(e) {
    if(e.target === mobileMenuPopup) hidePopUpMenu();
});

function showPopUpMenu() {
    mobileMenuPopup.style.display = 'flex';
    setTimeout(() =>mobileMenuPopup.style.opacity = 1, 300);
}

function hidePopUpMenu() {
    mobileMenuPopup.style.opacity = 0;
    setTimeout(() => mobileMenuPopup.style.display = 'none', 600);
}

/*****************************
 * 
 *  CONTACTS POPUP BLOCK
 * 
 */

const callBoxPopup = document.getElementById('callBox');
document.getElementById('callBoxButton').onclick =  showPopUpCallBox;

callBoxPopup.addEventListener('click', function(e) {
    if(e.target === callBoxPopup) hidePopUpCallBox();
});

function showPopUpCallBox() {
    callBoxPopup.style.display = 'flex';
    setTimeout(() =>callBoxPopup.style.opacity = 1, 300);
}

function hidePopUpCallBox() {
    callBoxPopup.style.opacity = 0;
    setTimeout(() => callBoxPopup.style.display = 'none', 600);
}

/*****************************
 * 
 *  BUTTONS LINKS CLICK
 * 
 */

function buttonLinkClick(url) {
    document.location.href = url;   
}

/*****************************
 * 
 *  FOOTER CURRENT YEAR
 * 
 */

document.getElementById('currentYear').innerHTML = ` - ${ new Date().getFullYear() }`;