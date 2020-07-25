// It holds all of our DOM elements, to avoid document.querySelector at
// multiple places in code.

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput : document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list')
};