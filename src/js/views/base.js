// It holds all of our DOM elements, to avoid document.querySelector at
// multiple places in code.

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
};

export const elementStrings = {
    loader: 'loader',
};

export const renderLoader = parent => {
    
    // The styling in css causes this to animate and rotate continuously.
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);

    if (loader) {
        loader.parentElement.removeChild(loader);
    }

};