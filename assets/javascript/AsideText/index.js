const ASIDE_TEXTCLASS = 'aside-text';

class AsideText {
  constructor(options = {}) {
    this.element = options.element;
    this.text = options.text || window.config.generals.site.title;
  }

  init() {
    this.initMarquee();
  }

  initMarquee(text = this.text) {
    const asideTemplate = `
      <div class="${ASIDE_TEXTCLASS}">${text}</div>
    `;
    this.element.innerHTML = asideTemplate;
  }
}

export default AsideText;
