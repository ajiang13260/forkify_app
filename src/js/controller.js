'use strict';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////
// 获取数据
const controlRecipes = async function () {
  try {
    // get hash change
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0)加载缓冲界面
    recipeView.renderSpinner();

    // 1)加载搜索结果界面
    resultsView.update(model.getSearchResultsPage());
    // 刷新bookmarks页面
    bookmarksView.update(model.state.bookmarks);

    // 2) 加载菜单数据
    await model.loadRecipe(id);

    // 3) 显示菜单界面
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
  } catch (err) {
    console.error(`🚧🚧 ${err} 🚧🚧`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) get search results
    await model.loadSearchResults(query);

    // 3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) show buttons of page
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`🚧🚧 ${err} 🚧🚧`);
  }
};

const controlPagination = function (goToPage) {
  // 3) render results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) show buttons of page
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1)更新servings和ingredients
  model.updateServings(newServings);
  // 2)重新加载recipe页面
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // add bookmark or delete
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update the icon
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // render to bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`🚧🚧 ${err} `);
    addRecipeView.renderError(err.message);
  }
};

// 监听hash change 和 page load
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPage(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
