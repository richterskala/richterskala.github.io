import 'url-search-params-polyfill';
import scrollToElement from 'scroll-to-element';
import arrayFrom from 'array-from';

import ContentSlot from '../ContentSlot';
import ImageLoader from '../ImageLoader';
import getEventHandlerResize from '../ResizeHandler';
import AsideText from '../AsideText';
import QueryHandler from '../QueryHandler';
import GTagEvent from '../GTagEvent';


const BREAKPOINT_KEYS = window.config.breakpointKeys;
const CONFIG = window.config;
const CONFIG_SCROLL = window.config.generals.scrollConfig;


const spanClass = (viewport) => {
  switch (viewport) {
    case BREAKPOINT_KEYS.xlarge:
      return 3;
    case BREAKPOINT_KEYS.large:
      return 3;
    case BREAKPOINT_KEYS.medium:
      return 4;
    case BREAKPOINT_KEYS.small:
      return 6;
    default:
      return 6;
  }
};

class ArticleRenderer {
  constructor(options = {}) {
    this.element = options.element;
    this.target = options.target;
    this.info = this.element.info;
    this.media = this.element.media;
    this.id = this.element.info.static.hash;
    // this.span = this.spanClass(window.innerWidth);
  }

  init() {
    console.log(this.media.audios);
    this.buildTemplate();
  }

  buildTemplate() {
    const imageSources = this.media.images;

    const template = `
      <article
        class="mod--content-overview__item grid-column-span--${spanClass(getEventHandlerResize().getCurrentViewport())} grid-row-span--2"
        id="${this.id}"
        data-id="${this.id}"
      >
        <div class="mod--content-overview__item__content__holder">
          <div class="mod--content-overview__item__content__title">
            <h1 class="h1">${this.info.static.title}</h1>
            ${this.returnIcons()}
          </div>
        </div>
        <div class="mod--content-overview__item__thumbs__holder">
          <div class="mod--content-overview__item__thumbs__content">
            ${this.returnThumbs(imageSources)}
          </div>
        </div>
      </article>
    `;
    this.renderInsideTarget(template, this.target);
    window.addEventListener(CONFIG.events.resize, () => this.setLayoutClasses());

  }

  setLayoutClasses() {
    const element = document.getElementById(this.id);
    element.classList.forEach((item) => {
      if (item.startsWith('grid-column-span--')) {
        element.classList.remove(item);
        element.classList.add(`grid-column-span--${spanClass(getEventHandlerResize().getCurrentViewport())}`);
      }
    });
  }

  returnThumbs(imageSources) {
    let template = '';

    Object.entries(imageSources).forEach((imageSource) => {
      const [key, source] = imageSource;
      const imageLoader = new ImageLoader({
        element: source[0],
        article: this.element,
      });
      template += imageLoader.renderThumbTemplate(source.entries[0]);
    });
    return template;
  }

  returnIcons() {
    let template = '';
    if (Object.keys(this.media.audios).length >= 1) {
      // console.log('Has Audio', Object.keys(this.media.audios).length);
      template += '<div class="icon__holder"><i class="la la-lg la-volume-down"></i></div>';
    }

    if (Object.keys(this.media.videos).length >= 1) {
      // console.log('Has Audio', Object.keys(this.media.audios).length);
      template += '<div class="icon__holder"><i class="la la-lg la-play"></i></div>';
    }

    return template;
  }

  renderInsideTarget(template, target) {
    target.innerHTML += template;
    window.setTimeout(() => {
      this.initActions();
    }, 100);
  }

  initActions() {
    if (document.getElementById(this.id)) {
      document.getElementById(this.id).addEventListener('click', () => {
        console.log('New Click on: ', this.id);
        const queryHandler = new QueryHandler({
          page: new URLSearchParams(window.location.search).get('page') || null,
          id: this.id,
          tag: new URLSearchParams(window.location.search).get('tag') || null,
        });

        queryHandler.init();

        const asideText = new AsideText({
          element: document.querySelector('aside'),
          text: this.element.info.static.title,
        });
        asideText.init();

        const contentSlot = new ContentSlot({
          element: this.element,
          article: this.element,
        });
        contentSlot.init();
        scrollToElement(document.querySelector('.mod--content-slot__wrapper'), CONFIG_SCROLL);

        const clickEvent = new GTagEvent({
          event: {
            type: 'click',
            category: `Opening Article: ${this.element.info.static.title}`,
            action: 'Open Article',
            label: `Opening Article: ${this.element.info.static.title}`,
            // value: this.element.info.static.hash,
          },
        });

        clickEvent.init();

        const key = 'AIzaSyAbB3PsKaWw3ZNCw19qkKWutuG86D0rfBI';
      });
    }
  }
}

export default ArticleRenderer;
