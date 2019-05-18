import QueryHandler from '../QueryHandler';

class TagPill {
  constructor(options = {}) {
    // this.element = options.element;
    this.tag = options.tag;
    this.tagPill = '';
  }

  init() {
    console.log('New Tag Pill: ', this.tag);
    this.tagPill = `<li class="tag-pill">${this.tag}</li>`;

    return this.tagPill;
  }

}

export default TagPill;
