import scrollToElement from 'scroll-to-element';
import arrayFrom from 'array-from';
import 'url-search-params-polyfill';
import ArticleRenderer from '../ArticleRenderer';
import ContentSlot from '../ContentSlot';
import AsideText from '../AsideText';
import QueryHandler from '../QueryHandler';
import GTagEvent from '../GTagEvent';

const CONFIG_SCROLL = window.config.generals.scrollConfig;

const CONFIG_PAGINATION = {
  itemsPerPage: 20,
  currentPage: 1,
  showArrows: true,
  pageKey: 'page',
};

const filtered = (articles) => {
  const tag = new URLSearchParams(window.location.search).get('tag') || null;
  console.log(articles);
  if (tag !== null) {
    console.log('Tag');
    const filteredArticles = [];
    articles.forEach((article) => {
      if (article.info.meta.tags.includes(tag)) {
        filteredArticles.push(article);
      }
    });
    console.log('Filtered Articles: ', filteredArticles);
    return filteredArticles;
  } else {
    return articles;
  }
};

class Pagination {
  constructor(options = {}) {
    this.element = options.element;
    // this.articles = options.articles || null;
    this.articles = filtered(options.articles);
    this.pages = Math.round(this.articles.length / CONFIG_PAGINATION.itemsPerPage);
    this.params = new URLSearchParams(window.location.search);
    this.currentPage = this.params.get('page') || CONFIG_PAGINATION.currentPage;
    this.currentItem = this.params.get('id') || null;
    this.tag = this.params.get('tag') || null;
    this.goToPage = null;
    this.oldPager = document.querySelector('.mod--pagination') || null;
  }

  init() {
    console.log('Pages: ', this.pages, this.articles.length, this.articles);

    this.checkArticleLength();
    this.paginateArticles();
    return {
      articles: this.articles,
      currentPage: this.currentPage,
    };
  }


  paginateArticles() {
    const results = [];
    while (this.articles.length) {
      results.push(this.articles.splice(0, CONFIG_PAGINATION.itemsPerPage));
    }
    this.articles = results;
    // console.log('Articles after pagination: ', this.articles);
    // this.toPage();
    this.lookForItem();

  }

  checkArticleLength() {
    if (this.articles.length > CONFIG_PAGINATION.itemsPerPage && this.oldPager === null) {
      this.initPagerItems();
    }
  }

  initPagerItems() {
    let pagerTemplate = `
      <ul class="pager">
    `;

    for (let i = 0; i < this.pages; i += 1) {
      pagerTemplate += `<li class="pager-item" data-${CONFIG_PAGINATION.pageKey}="${i + 1}">${i + 1}</li>`;
    }
    pagerTemplate += '</ul>';

    const pagerSection = document.createElement('section');
    pagerSection.innerHTML = pagerTemplate;
    pagerSection.classList.add('mod--pagination');

    document.querySelector('main').appendChild(pagerSection);

    this.initActions();
  }

  initActions() {
    const pagerItems = document.querySelectorAll('.pager-item');
    arrayFrom(pagerItems).forEach((pagerItem) => {
      pagerItem.addEventListener('click', () => {
        this.stripId();
        this.currentPage = pagerItem.dataset.page;
        this.tag = new URLSearchParams(window.location.search).get('tag');
        console.log(pagerItem, this.currentPage);
        const queryHandler = new QueryHandler({
          page: this.currentPage,
          id: null,
          tag: this.tag,
        });

        queryHandler.init();

        this.renderArticles();
        this.activeState(this.currentPage);
      });
    });
  }

  stripId() {
    if (this.currentItem !== null) {
      this.params.delete('id');
      this.toPage(this.currentPage);
    }
  }

  toPage() {
    if (this.currentPage > this.pages) {
      this.currentPage = CONFIG_PAGINATION.currentPage;
    }

    const queryHandler = new QueryHandler({
      page: this.currentPage,
      id: this.currentItem,
      tag: this.tag,
    });

    queryHandler.init();

    this.renderArticles();
    this.activeState();
  }

  renderArticles() {
    this.element.innerHTML = '';
    // console.log('Render Articles Before', this.element.innerHTML);
    console.log('Current Page: ', this.articles[this.currentPage - 1]);
    arrayFrom(this.articles[Number(this.currentPage - 1)]).forEach((article) => {
      // console.log('Article', article);
      const articleRenderer = new ArticleRenderer({
        element: article,
        target: document.querySelector('.mod--content-overview'),
      });
      articleRenderer.init();
    });

    // console.log('Render Articles', this.element.innerHTML);
  }

  lookForItem() {
    if (this.currentItem !== null) {
      console.log('Looking for ID', this.currentItem);
      this.articles.forEach((array, index) => {
        array.findIndex((element) => {
          if (this.currentItem === element.info.static.hash) {
            scrollToElement(document.getElementById(element.info.static.hash), CONFIG_SCROLL);
            const asideText = new AsideText({
              element: document.querySelector('aside'),
              text: element.info.static.title,
            });
            asideText.init();
            this.currentPage = index + 1;
            this.toPage();
            this.openSlot(element);
            console.log('Gude', element, this.currentPage);
          } else {
            console.log('Not matching');
          }
        });
      });
    } else {
      this.toPage();
    }
  }

  openSlot(element) {
    const contentSlot = new ContentSlot({
      element,
      article: element,
    });
    contentSlot.init();
  }

  activeState(page) {
    const selectPage = page || this.currentPage;
    const pagerItems = document.querySelectorAll('.pager-item');

    arrayFrom(pagerItems).forEach((item) => {
      console.log(item, item.dataset.page, selectPage);
      if (Number(selectPage) === Number(item.dataset.page)) {
        // console.log('Match');
        item.classList.add('active');
      } else {
        // console.log('No Match');
        item.classList.remove('active');
      }
    });

    const pageChangeEvent = new GTagEvent({
      event: {
        type: 'page_change',
        category: `Changing Page to: ${selectPage}`,
        action: 'Changing Page',
        label: `Changing Page to: ${selectPage}`,
        // value: this.element.info.static.hash,
      },
    });

    pageChangeEvent.init();
  }
}

export default Pagination;
