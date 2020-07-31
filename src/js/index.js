// Global App Controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */
const state = {};
window.state = state;

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. Get the query from the view.
    const query = searchView.getInput();

    if (query) {
        // 2. New search object to add to state
        state.search = new Search(query);

        // 3. Prepare UI for results.
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    // We want the button, even if we click at the text in
    // button or in the icon.
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // 10 is the radix
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);
    }
});

/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // window.location is the entire URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlighted selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // Create the recipe Object
        state.recipe = new Recipe(id);

        try {
            // Get Recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();

            // Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));

        } catch (error) {
            console.log(error);
            alert('Error processing recipe!');
        }
    }

};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list)
        state.list = new List();

    // Clear the list
    listView.clearList();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle and delete and update list item events
elements.shopping.addEventListener('click',  e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    }
    // Handle the count update 
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/** 
 * LIKES CONTROLLER
 */
const controlLike = () => {
    if (!state.likes)
        state.likes = new Likes();

    const currentId = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
       
        // Add like to state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);

    } 
    // User HAS liked the current recipe
    else {

        // Delete like from state
        state.likes.deleteLike(currentId);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Delete like from the UI list
        likesView.deleteLike(currentId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {

    // .btn-decrease * means any selector under btn-decrease (i.e. child elements).
    // * is the universal selector (here under btn-decrease).
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

        // Add ingredients to shopping list
        controlList();
    
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {

        // Like Controller
        controlLike();
    }

    console.log(state.recipe);
});