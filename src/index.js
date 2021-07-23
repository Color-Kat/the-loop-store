import dropDownMenu from './modules/dropDownMenu';
import toggleMenu from './modules/toggleMenu';
import touch_class from './modules/touch_class';
import './scss/style.scss';

dropDownMenu();
touch_class();

document.querySelector('.menu__icon').addEventListener('click', toggleMenu);