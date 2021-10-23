const toggleMenu = () => {
  const navElement = document.querySelector('#nav');
  const menuButtonElement = document.querySelector('#menuButton');
  const menuButtonIconElement = document.querySelector('#menuButtonIcon');

  navElement.classList.toggle('landing__header__inner__nav--active');
  menuButtonElement.classList.toggle('landing__header__inner__menu--active');
  menuButtonIconElement.classList.toggle('fa-times');
  menuButtonIconElement.classList.toggle('fa-bars');
};

document.querySelector('#menuButton').addEventListener('click', toggleMenu);

// Change the header's background if the page is
// scrolled at least half the header's height
const updateHeaderBackground = () => {
  const headerElement = document.querySelector('#header');

  if (window.pageYOffset >= headerElement.clientHeight / 2) {
    return headerElement.classList.add('landing__header--active');
  }

  headerElement.classList.remove('landing__header--active');
};

// Call the function once on page load to avoid having
// a transparent header background when user scrolls
// and then reloads the page
updateHeaderBackground();
window.addEventListener('scroll', updateHeaderBackground);

// Smoothly scroll to desired section on clicking nav links
document
  .querySelectorAll('.landing__header__inner__nav a')
  .forEach((element) => {
    element.addEventListener('click', function (e) {
      e.preventDefault();

      if (document.querySelector('.landing__header__inner__nav--active')) {
        toggleMenu();
      }

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    });
  });

// Highlight the nav list item corresponding
// to the the section currently intersecting
// with the viewport
const highlightCurrentSection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document
        .querySelectorAll('.landing__header__inner__nav li')
        .forEach((element) => element.classList.remove('current'));

      document
        .querySelector(
          `.landing__header__inner__nav li[data-scroll-to="${entry.target.id}"]`,
        )
        .classList.add('current');
    }
  });
};

const options = {
  threshold: 0.75,
};

let observer = new IntersectionObserver(highlightCurrentSection, options);

observer.observe(document.querySelector('#home'));
observer.observe(document.querySelector('#most-booked'));
observer.observe(document.querySelector('#book'));
observer.observe(document.querySelector('#about-us'));
