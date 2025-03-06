// Initialize variables to store DOM elements and states
let gridContainer;
let gridItems;
let shuffleButton;
let sortButton;
let searchButton;
let searchClearButton;
let searchContent;
let searchContentOriginal;
let searchDialog;
let searchInput;
let closeDialog;

/* Event handler functions */

// Shuffle grid: trigger grid shuffling.
const handleShuffleClick = () => shuffleGrid();

// Sort grid: trigger grid sorting.
const handleSortClick = () => sortGrid();

// Open search dialog: show the dialog and blur the page.
const handleSearchClick = () => {
  searchDialog.showModal();
  toggleDialogPageBlur(true);
};

// Close search dialog: hide the dialog and remove the blur.
const handleCloseClick = () => {
  searchDialog.close();
  toggleDialogPageBlur(false);
};

// Clear search: reset the filter and clear the input.
const handleSearchClearClick = () => {
  filterGrid('');
  toggleClearButton();
  searchContent.innerHTML = searchContentOriginal;
  searchInput.value = '';
  searchButton.classList.remove('search--active');
};

// Filter grid: update grid items based on the search input.
const handleSearchInput = (e) => {
  const searchTerm = e.target.value;
  filterGrid(searchTerm);
  searchContent.innerHTML = searchTerm === '' ? searchContentOriginal : searchTerm;
  toggleClearButton(searchTerm);
  searchButton.classList.toggle('search--active', searchTerm !== '');
};

/* Initialize DOM elements and states */
const initializeVariables = () => {
  gridContainer = document.querySelector('[data-grid]');
  gridItems = Array.from(gridContainer?.children || []);
  shuffleButton = document.querySelector('[data-shuffle]');
  sortButton = document.querySelector('[data-sort]');
  searchButton = document.querySelector('[data-search]');
  searchClearButton = document.querySelector('[data-clear]');
  searchContent = searchButton?.querySelector('.oh__inner');
  searchContentOriginal = searchContent?.innerHTML || '';
  searchDialog = document.getElementById('search-dialog');
  searchInput = document.getElementById('search-input');
  closeDialog = document.getElementById('close-dialog');
};

/* Shuffle grid items randomly and update the container */
const shuffleGrid = () => {
  const shuffledItems = gridItems.sort(() => Math.random() - 0.5);
  if (gridContainer) {
    gridContainer.innerHTML = '';
    shuffledItems.forEach((item) => gridContainer.appendChild(item));
  }
};

/* Sort grid items alphabetically by 'data-stagename' */
const sortGrid = () => {
  const sortedItems = gridItems.sort((a, b) => {
    const nameA = a.getAttribute('data-stagename').toLowerCase();
    const nameB = b.getAttribute('data-stagename').toLowerCase();
    return nameA.localeCompare(nameB);
  });
  if (gridContainer) {
    gridContainer.innerHTML = '';
    sortedItems.forEach((item) => gridContainer.appendChild(item));
  }
};

/* Filter grid items based on the search input */
const filterGrid = (searchValue) => {
  const lowerCaseSearch = searchValue.toLowerCase();
  gridItems.forEach((item) => {
    const name = item.getAttribute('data-name').toLowerCase();
    const stagename = item.getAttribute('data-stagename').toLowerCase();
    item.style.display =
      name.includes(lowerCaseSearch) || stagename.includes(lowerCaseSearch)
        ? ''
        : 'none';
  });
};

/* Toggle page blur when the search dialog is open or closed */
const toggleDialogPageBlur = (toggle) => {
  if (toggle) {
    document.body.classList.add('blurred');
  } else {
    document.body.classList.remove('blurred');
  }
};

/* Show or hide the clear button based on search input */
const toggleClearButton = (searchTerm = '') => {
  const isHidden = searchClearButton?.classList.contains('hidden');
  if (searchTerm === '' && !isHidden) {
    searchClearButton.classList.add('hidden');
  } else if (searchTerm !== '' && isHidden) {
    searchClearButton.classList.remove('hidden');
  }
};

/* Initialize event listeners and states */
const init = () => {
  initializeVariables();
  shuffleButton?.addEventListener('click', handleShuffleClick);
  sortButton?.addEventListener('click', handleSortClick);
  searchButton?.addEventListener('click', handleSearchClick);
  closeDialog?.addEventListener('click', handleCloseClick);
  searchClearButton?.addEventListener('click', handleSearchClearClick);
  searchInput?.addEventListener('input', handleSearchInput);
  searchDialog?.addEventListener('close', () => toggleDialogPageBlur(false));
};

/* Cleanup event listeners and reset variables */
const cleanup = () => {
  shuffleButton?.removeEventListener('click', handleShuffleClick);
  sortButton?.removeEventListener('click', handleSortClick);
  searchButton?.removeEventListener('click', handleSearchClick);
  closeDialog?.removeEventListener('click', handleCloseClick);
  searchClearButton?.removeEventListener('click', handleSearchClearClick);
  searchInput?.removeEventListener('input', handleSearchInput);
  gridContainer = null;
  gridItems = [];
  shuffleButton = null;
  sortButton = null;
  searchButton = null;
  searchClearButton = null;
  searchContent = null;
  searchContentOriginal = '';
  searchDialog = null;
  searchInput = null;
  closeDialog = null;
};

/* Handle Astro page events on the home page */
const handlePageEvent = (type) => {
  const page = document.documentElement.getAttribute('data-page');
  if (page !== 'home') return;
  if (type === 'load') {
    init();
  } else if (type === 'before-swap') {
    cleanup();
  }
};

// Listen for Astro's lifecycle events
document.addEventListener('astro:page-load', () => handlePageEvent('load'));
document.addEventListener('astro:before-swap', () => handlePageEvent('before-swap'));


// Flippable Card Grid
function flipCard(card) {
  card.classList.toggle('flipped');
}
const addCharactersToPage = characters => {
  const characterList = characters
      .map(character => {
        const { episode = [], gender, image, location = {}, name, species, status } = character;

        return `
      <li class="card__item">
        <button aria-label="Flip card for details" class="card__button" onclick=flipCard(this) type="button">
          <div class="card__front">
            <img 
              alt="${name}"
              class="card__image"
              height="288"
              loading="lazy"
              src="${image}"
              width="288"
            />
            <h2 class="card__name">${name}</h2>
          </div>
          <div class="card__back">
            <dl class="card__description">
              <dt class="card__term">Name</dt>
              <dd class="card__detail">${name}</dd>
              <dt class="card__term">Species</dt>
              <dd class="card__detail">${species}</dd>
              <dt class="card__term">Gender</dt>
              <dd class="card__detail">${gender}</dd>
              <dt class="card__term">Status</dt>
              <dd class="card__detail">${status}</dd>
              <dt class="card__term">Location</dt>
              <dd class="card__detail">${location.name}</dd>
              <dt class="card__term">Appearances</dt>
              <dd class="card__detail">${episode.length}</dd>
            </dl>
          </div>
        </button>
      </li>
    `;
      })
      .join('');

  if (document.querySelector('#character-list')) document.querySelector('#character-list').innerHTML = characterList;
};
const getPaginatedData = async url => {
  const data = [];
  let nextUrl = url;

  while (nextUrl) {
    const pageData = await (await fetch(nextUrl)).json();
    nextUrl = await pageData?.info?.next;
    await data.push(...pageData.results);
  }

  return data;
};
const addDataToPage = async () => {
  const characters = await getPaginatedData('https://rickandmortyapi.com/api/character');
  addCharactersToPage(characters);
};
addDataToPage();
