'use strict';

const menuButton = document.querySelector('.main-navigation__button');
const navBlock = document.querySelector('.main-navigation');

menuButton.addEventListener('click', () => {
  if (navBlock.classList.contains('main-navigation--closed')) {
    navBlock.classList.remove('main-navigation--closed');
    navBlock.classList.add('main-navigation--opened')

  } else {
    navBlock.classList.add('main-navigation--closed');
    navBlock.classList.remove('main-navigation--opened')
  }
});