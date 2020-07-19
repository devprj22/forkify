// Global App Controller
import Search from './models/Search';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */
const state = {};

const controlSearch = async () => {
    // 1. Get the query from the view.
    const query = 'pizza';

    if (query) {
        // 2. New search object to add to state
        state.search = new Search(query);

        // 3. Prepare UI for results.

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

const search = new Search('pizza');
console.log(search);
search.getResults();