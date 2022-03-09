import { View } from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerPage(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const goToPage = +btn.dataset.page;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPage
    );

    // 1) page 1, other pages
    if (curPage === 1 && numPage > 1)
      return this._generateMarkupButton(false, curPage);
    // 2) last page
    if (curPage === numPage && numPage > 1)
      return this._generateMarkupButton(true, curPage);
    // 3) other page
    if (curPage > 1 && curPage < numPage && numPage > 1)
      return (
        this._generateMarkupButton(true, curPage) +
        this._generateMarkupButton(false, curPage)
      );
    // 4) page 1, NO other page
    return '';
  }

  _generateMarkupButton(isPrev = false, curPage) {
    if (isPrev)
      return `
        <button data-page=${
          curPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;

    if (!isPrev)
      return `
        <button data-page=${
          curPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
