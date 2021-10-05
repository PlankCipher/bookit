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

  navElement.classList.toggle('landing__header__inner__nav--active');
  menuButtonElement.classList.toggle('landing__header__inner__menu--active');
  menuButtonIconElement.classList.toggle('fa-times');
  menuButtonIconElement.classList.toggle('fa-bars');
};

document.querySelector('#menuButton').addEventListener('click', toggleMenu);

const updateHeaderBackground = () => {
  const headerElement = document.querySelector('#header');

  if (window.pageYOffset >= headerElement.clientHeight / 2) {
    return headerElement.classList.add('landing__header--active');
  }

  headerElement.classList.remove('landing__header--active');
};

updateHeaderBackground();
window.addEventListener('scroll', updateHeaderBackground);

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

document.querySelector('#arrow').addEventListener('click', () => {
  document.querySelector('#most-booked').scrollIntoView({
    behavior: 'smooth',
  });
});

const MIN_WIDTH_TO_OPEN_SELECT_ELEMENTS = 1200;

if (window.innerWidth <= MIN_WIDTH_TO_OPEN_SELECT_ELEMENTS) {
  const selectElementsWidths = [];
  document.querySelectorAll('.book__search_bar select').forEach((element) => {
    const { id, clientWidth } = element;
    selectElementsWidths.push({ id, width: clientWidth });
    element.style.width = '0';
  });

  document.querySelectorAll('.book__search_bar i').forEach((iconElement) => {
    iconElement.addEventListener('click', (event) => {
      document
        .querySelectorAll('.book__search_bar select')
        .forEach((selectElement) => {
          selectElement.style.width = '0';
        });

      const idOfSelectElementToOpen = event.target.dataset.openSelect;
      const selectElementToOpen = document.querySelector(
        `.book__search_bar select[id=${idOfSelectElementToOpen}]`,
      );
      const { width: widthOfSelectElementToOpen } = selectElementsWidths.find(
        ({ id }) => id === idOfSelectElementToOpen,
      );

      selectElementToOpen.style.width = `${widthOfSelectElementToOpen}px`;
    });
  });
}
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
