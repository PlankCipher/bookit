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

const generateSelectHTML = (iconClasses, selectId, defaultOption, options) => {
  let selectHTML = `<div>
                      <i class="${iconClasses}" data-open-select="${selectId}"></i>
                      <select name="${selectId}" id="${selectId}">
                        <option value="">${defaultOption}</option>`;

  options.forEach((option) => {
    selectHTML += `<option value="${option}">${option}</option>`;
  });

  selectHTML += `</select>
              </div>`;

  return selectHTML;
};

const MIN_WIDTH_TO_OPEN_SELECT_ELEMENTS = 1200;

const shrinkSelectElements = () => {
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
};

const setAllFilters = async () => {
  const response = await fetch('/halls/all-filters');
  const { categories, styles, places } = await response.json();

  const categoriesHTML = generateSelectHTML(
    'fas fa-calendar-alt',
    'category',
    'Category',
    categories,
  );

  const stylesHTML = generateSelectHTML(
    'fas fa-palette',
    'style',
    'Style',
    styles,
  );

  const placesHTML = generateSelectHTML(
    'fas fa-map-marker-alt',
    'place',
    'Place',
    places,
  );

  const finalHTML = categoriesHTML + stylesHTML + placesHTML;
  document
    .querySelector('.book__search_bar button')
    .insertAdjacentHTML('beforebegin', finalHTML);

  shrinkSelectElements();
};

(async () => {
  await setAllFilters();
})();

const handleButtonClick = async (event, id) => {
  const response = await fetch(`/halls/book/${id}`, {
    method: 'PUT',
  });
  const { name, price, booked_till } = await response.json();
  const bookedTill = new Date(booked_till);

  if (response.status !== 200) {
    Swal.fire({
      title: 'Error!',
      text: 'Sorry! An Error occurred during booking this hall. Please try again later!',
      icon: 'error',
    });

    return;
  }

  const parentElement = event.target.parentNode;

  parentElement.removeChild(event.target);
  parentElement.insertAdjacentHTML(
    'beforeend',
    `<p>Booked till: ${bookedTill.toDateString()}</p>`,
  );

  Swal.fire({
    title: 'Success',
    text: `You successfully booked the "${name}" hall for ${price}$/night till ${bookedTill.toDateString()}`,
    icon: 'success',
  });
};

const displayHalls = (halls) => {
  const hallsHTML = halls.reduce((acc, curr) => {
    const { id, name, price, booked_till } = curr;

    const bookedTill = new Date(booked_till);

    return (acc += `<div class="book__results__halls__hall">
                      <div class="book__results__halls__hall__overlay">
                        <h2>${name}</h2>
                        <p>${price}$/night</p>
                        ${
                          booked_till &&
                          new Date().getTime() < bookedTill.getTime()
                            ? `<p>Booked till: ${bookedTill.toDateString()}</p>`
                            : `<button type="button" onclick="handleButtonClick(event, ${id})">Book</button>`
                        }
                      </div>
                    </div>`);
  }, '');

  document.querySelector('.book__results__halls').innerHTML = hallsHTML;
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const selectValues = Array.from(
    document.querySelectorAll('.book__search_bar select'),
  ).map((selectElement) => selectElement.value.trim());

  const anyIsEmpty = selectValues.some((value) => value.length === 0);
  if (anyIsEmpty) {
    Swal.fire({
      title: 'Error!',
      text: 'You need to choose one item from each dropdown menu',
      icon: 'error',
    });

    return;
  }

  const [category, style, place] = selectValues;

  const response = await fetch('/halls/by-filters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters: { category, style, place } }),
  });

  if (response.status === 404) {
    document.querySelector('.book__results__halls').innerHTML =
      '<div class="book__results__halls__message">No halls matching provided filters were found</div>';
  }

  const halls = await response.json();
  displayHalls(halls);
};

document
  .querySelector('.book__search_bar form')
  .addEventListener('submit', handleFormSubmit);

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
