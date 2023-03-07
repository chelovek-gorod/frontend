'use strict';

/*************
 * 
 *  SLIDER
 * 
 */

const nextImageTimeout = 4800;

const mainSlider = document.getElementById('mainSlider');
let sliderImagesArr = mainSlider.querySelectorAll('.slide-img');
let currentImage = 0;

const selectSlidePointsArr = [];

let sliderTimeoutId;

if (sliderImagesArr.length > 1) {

    const previousSlideBtn = document.createElement('div');
    previousSlideBtn.className = "slide-button previous";
    previousSlideBtn.innerHTML = "<";
    mainSlider.append(previousSlideBtn);

    const nextSlideBtn = document.createElement('div');
    nextSlideBtn.className = "slide-button next";
    nextSlideBtn.innerHTML = ">";
    mainSlider.append(nextSlideBtn);

    const selectSlideDiv = document.createElement('div');
    selectSlideDiv.className = "select-slide";
    mainSlider.append(selectSlideDiv);

    sliderImagesArr.forEach( (el, index) => {
        const selectSlideBtn = document.createElement('div');
        selectSlideBtn.className = "select-slide-button";
        selectSlideBtn.index = index;
        selectSlideBtn.onclick = function(element) {
            clearTimeout(sliderTimeoutId);

            selectSlidePointsArr[currentImage].classList.remove('active');
            currentImage = element.target.index;
            selectSlidePointsArr[currentImage].classList.add('active');

            sliderImagesArr.forEach( (img, i) => {
                if (i > currentImage) img.style.opacity = 0;
                else img.style.opacity = 1;
            });
            sliderTimeoutId = setTimeout(showNextSlide, nextImageTimeout);
        }
        selectSlidePointsArr.push(selectSlideBtn);
        selectSlideDiv.append(selectSlideBtn);
    });

    selectSlidePointsArr[currentImage].classList.add('active');

    previousSlideBtn.onclick = function() {
        clearTimeout(sliderTimeoutId);
        selectSlidePointsArr[currentImage].classList.remove('active');
        currentImage--;

        if (currentImage < 0) currentImage = sliderImagesArr.length - 1;
        selectSlidePointsArr[currentImage].classList.add('active');

        sliderImagesArr.forEach( (img, i) => {
            if (i > currentImage) img.style.opacity = 0;
            else img.style.opacity = 1;
        });
        sliderTimeoutId = setTimeout(showNextSlide, nextImageTimeout);
    }
    
    nextSlideBtn.onclick = function() {
        clearTimeout(sliderTimeoutId);
        selectSlidePointsArr[currentImage].classList.remove('active');
        currentImage++;

        if (currentImage > sliderImagesArr.length - 1) currentImage = 0;
        selectSlidePointsArr[currentImage].classList.add('active');
        sliderImagesArr.forEach( (img, i) => {
            if (i > currentImage) img.style.opacity = 0;
            else img.style.opacity = 1;
        });
        sliderTimeoutId = setTimeout(showNextSlide, nextImageTimeout);
    }

    sliderTimeoutId = setTimeout(showNextSlide, nextImageTimeout);
}

function showNextSlide() {
    selectSlidePointsArr[currentImage].classList.remove('active');

    if ( currentImage < sliderImagesArr.length - 1 ) {
        currentImage++;
        sliderImagesArr[currentImage].style.opacity = 1;
    } else {
        currentImage = 0;
        sliderImagesArr.forEach( (img, i) => {if (i > 0) img.style.opacity = 0;});
    }

    selectSlidePointsArr[currentImage].classList.add('active');
    sliderTimeoutId = setTimeout(showNextSlide, nextImageTimeout);
}