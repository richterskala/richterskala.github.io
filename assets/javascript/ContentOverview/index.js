import 'url-search-params-polyfill';
import scrollToElement from 'scroll-to-element';
import arrayFrom from 'array-from';

import Pagination from '../Pagination';

const CONFIG_SCROLL = window.config.generals.scrollConfig;

class ContentOverview {
  constructor(options = {}) {
    this.element = options.element;
    this.json = {};
    this.articles = null;
    this.query = window.location.search || null;
  }

  init() {
    this.fetchContentFromApi();
  }

  fetchContentFromApi() {
    fetch('api')
      .then(res => res.json())
      .then((data) => {
        window.config.generals.site = {
          title: data.config.site.title,
        };
        console.log('Data Articles: ', data.articles);
        if (!document.querySelector('.mod--site-info')) {
          this.insertTitle(data.config.site);
        }
        this.articles = data.articles;
        const pagination = new Pagination({ element: this.element, articles: this.articles }).init();
        this.articles = pagination.articles;
        this.currentPage = pagination.currentPage;
      });
  }

  insertTitle(info) {
    const siteInfoTemplate = `
      <section class="mod--site-info">
        <div class="mod--site-info__holder grid">
          <div class="mod--site-info__holder__title grid-column-span--6">
            <h1>${info.title}</h1>
          </div>
          <div class="mod--site-info__holder__description grid-column-span--6">
            <p class="mod--site-info__description">${info.description}</p>
          </div>
        </div>
      </section>
    `;
    this.element.parentNode.insertAdjacentHTML('afterbegin', siteInfoTemplate);
  }
}

export default ContentOverview;
