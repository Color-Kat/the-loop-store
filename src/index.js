import Swiper, {
    Pagination,
    Autoplay
} from 'swiper';
import 'swiper/swiper-bundle.css';
import dropDownMenu from './modules/dropDownMenu';
import elementMoveTo from './modules/elementMoveTo';
import toggleMenu from './modules/toggleMenu';
import touch_class from './modules/touch_class';
import './scss/style.scss';

dropDownMenu();
touch_class();
elementMoveTo();

// click on menu burder to open mobile menu
document.querySelector('.menu__icon').addEventListener('click', toggleMenu);

// configure Swiper to use modules
Swiper.use([Pagination, Autoplay]);
const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    // direction: 'gorizontal',
    // loop: true,
    autoplay: {
        delay: 5000,
    },

    // // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },

    // // Navigation arrows
    // navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    // },
});