import arrayFrom from 'array-from';

class QueryHandler {
  constructor(options = {}) {
    this.element = options.element;
    this.page = options.page || null;
    this.id = options.id || null;
    this.tag = options.tag || null;
    this.params = new URLSearchParams(window.location.search);
  }

  init() {
    console.log('QueryHander init', this.page, this.id, this.tag);

    if (this.params.get('page')) {
      this.params.delete('page');
    }

    if (this.params.get('id')) {
      this.params.delete('id');
    }

    if (this.params.get('tag')) {
      this.params.delete('tag');
    }

    if (this.page !== null) {
      this.params.append('page', this.page);
    }

    if (this.id !== null) {
      this.params.append('id', this.id);
    }

    if (this.tag !== null) {
      this.params.append('tag', this.tag);
    }

    this.activateArticle(this.id);

    window.history.pushState({}, '', `${window.location.pathname}?${this.params}`);
  }

  activateArticle(id) {
    window.setTimeout(() => {
      const items = document.querySelectorAll('.mod--content-overview__item');
      arrayFrom(items).forEach((item) => {
        const selectedItem = document.getElementById(item.id);
        if (item.id === id) {
          selectedItem.classList.add('active');
        } else {
          selectedItem.classList.remove('active');
        }
      });
    }, 300);
  }
}

export default QueryHandler;
