new TypeIt('#typeit', {
  speed: 50,
  deleteSpeed: 50,
  loop: true,
  cursorSpeed: 1000,
  waitUntilVisible: true,
  lifeLike: true,
})
  .type(
    "Save time ... BOOK<span style='color: var(--primary-purple-color)'>IT</span>",
  )
  .pause(1000)
  .delete()
  .type(
    "Choose<span style='color: var(--primary-purple-color)'> category</span>",
  )
  .pause(1000)
  .delete(9)
  .type("<span style='color: var(--primary-purple-color)'> place</span>")
  .pause(1000)
  .delete(6)
  .type("<span style='color: var(--primary-purple-color)'> style</span>")
  .pause(1000)
  .delete()
  .type("<span style='color: var(--primary-purple-color)'>Enjoy</span>")
  .pause(1000)
  .delete()
  .go();

const toggleMenu = () => {
  const navElement = document.querySelector('#nav');
  const menuButtonElement = document.querySelector('#menuButton');
  const menuButtonIconElement = document.querySelector('#menuButtonIcon');

  if (navElement.classList.contains('landing__header__inner__nav--active')) {
    navElement.classList.remove('landing__header__inner__nav--active');
    menuButtonElement.classList.remove('landing__header__inner__menu--active');
    menuButtonIconElement.classList.remove('fa-times');
    menuButtonIconElement.classList.add('fa-bars');
    return;
  }

  navElement.classList.add('landing__header__inner__nav--active');
  menuButtonElement.classList.add('landing__header__inner__menu--active');
  menuButtonIconElement.classList.remove('fa-bars');
  menuButtonIconElement.classList.add('fa-times');
};

document.querySelector('#menuButton').addEventListener('click', toggleMenu);

window.onscroll = () => {
  const headerElement = document.querySelector('#header');

  if (window.pageYOffset >= headerElement.clientHeight / 2) {
    return headerElement.classList.add('landing__header--active');
  }

  headerElement.classList.remove('landing__header--active');
};

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
  threshold: 0.5,
};

let observer = new IntersectionObserver(highlightCurrentSection, options);

observer.observe(document.querySelector('#home'));
observer.observe(document.querySelector('#most-booked'));
observer.observe(document.querySelector('#book'));
observer.observe(document.querySelector('#about-us'));
