import 'url-search-params-polyfill';
import scrollToElement from 'scroll-to-element';
import arrayFrom from 'array-from';
import SlotLayoutSection from '../SlotLayoutSection';
import getEventHandlerResize from '../ResizeHandler';
import ContentSlider from '../ContentSlider';
import QueryHandler from '../QueryHandler';
import GTagEvent from '../GTagEvent';
import AsideText from '../AsideText';
import ContentOverview from '../ContentOverview';


const BREAKPOINT_KEYS = window.config.breakpointKeys;
const CONFIG_SCROLL = window.config.generals.scrollConfig;

const CLASSNAME_CONTENTSLOT = 'mod--content-slot';

const insertPosition = (viewport, currentElement) => {
  const overviewItems = document.querySelectorAll('article.mod--content-overview__item');
  const itemPosition = arrayFrom(overviewItems).findIndex((element) => {
    return element.id === currentElement.info.static.hash;
  });

  // console.log('Item Position: ', itemPosition, currentElement.info.static.hash);

  let itemsPerRow = null;
  switch (viewport) {
    case BREAKPOINT_KEYS.xlarge:
      itemsPerRow = 4;
      break;
    case BREAKPOINT_KEYS.large:
      itemsPerRow = 4;
      break;
    case BREAKPOINT_KEYS.medium:
      itemsPerRow = 3;
      break;
    case BREAKPOINT_KEYS.small:
    default:
      itemsPerRow = 2;
      break;
  }

  const modulo = () => {
    if (itemPosition !== 0) {
      return itemPosition % itemsPerRow;
    } else {
      return 1;
    }
  }

  const insertPosition = () => {
    if (itemPosition !== 0) {
      return itemPosition - modulo() + itemsPerRow;
    } else {
      return itemPosition - modulo() + itemsPerRow + 1;
    }
  };

  return insertPosition();
};

class ContentSlot {
  constructor(options = {}) {
    this.element = options.element;
    this.article = options.article;

    this.insertPosition = insertPosition(getEventHandlerResize().getCurrentViewport(), this.element);
    this.oldSlot = document.querySelector(`.${CLASSNAME_CONTENTSLOT}__wrapper`) || null;
    this.structure = this.element.structure || null;
    this.slotWrapper = null;
    this.id = this.element.info.static.hash;
    this.params = new URLSearchParams(window.location.search);
    this.page = this.params.get('page') || null;
    this.tag = this.params.get('tag') || null;
  }

  init() {
    this.removeOldSlot();
    // console.log('Content Slot Init; Insert Position: ', this.insertPosition);
    this.generateSlot();
  }

  closeSlot() {
    this.slotWrapper.classList.add('closing');
    this.slotWrapper.addEventListener('transitionend', () => {
      this.slotWrapper.parentNode.removeChild(this.slotWrapper);
    });

    scrollToElement(document.getElementById(this.id), CONFIG_SCROLL);
    const asideText = new AsideText({
      element: document.querySelector('aside'),
      text: undefined,
    });
    asideText.init();
  }

  removeOldSlot() {
    // console.log('Removing Old Slot', this.oldSlot);
    if (this.oldSlot !== null) {
      this.oldSlot.parentNode.removeChild(this.oldSlot);
    }
  }

  generateSlot() {
    const slotWrapper = document.createElement('article');

    slotWrapper.classList.add(`${CLASSNAME_CONTENTSLOT}__wrapper`);
    slotWrapper.classList.add('grid-column-span--12');
    const overviewItems = document.querySelectorAll('article.mod--content-overview__item');

    document.querySelector('.mod--content-overview').insertBefore(slotWrapper, overviewItems[this.insertPosition]);
    this.slotWrapper = slotWrapper;
    this.generateSlotLayout();
  }

  generateSlotLayout() {
    const articleInfoTemplate = `
      <section class="${CLASSNAME_CONTENTSLOT}__info">
        <div class="${CLASSNAME_CONTENTSLOT}__info__holder grid">
          <div class="${CLASSNAME_CONTENTSLOT}__info__holder__title grid-column-span--6">
            <h1>${this.article.info.static.title}</h1>
          </div>
          <div class="${CLASSNAME_CONTENTSLOT}__info__holder__description grid-column-span--6">
            <p>${this.article.info.additionals.subtitle}</p>
          </div>
        </div>
      </section>
    `;
    this.slotWrapper.insertAdjacentHTML('afterbegin', articleInfoTemplate);

    /**
     * Generate Close Button
     */
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '<i class="la la-lg la-close"></i>';
    closeButton.addEventListener('click', () => {
      // console.log('Closing?');
      this.closeSlot();
      const queryHandler = new QueryHandler({
        page: new URLSearchParams(window.location.search).get('page'),
        id: null,
        tag: this.tag,
      });
      queryHandler.init();

      const closeEvent = new GTagEvent({
        event: {
          type: 'close',
          category: `Closing Content Slot: ${this.element.info.static.title}`,
          action: 'Closing Content Slot',
          label: `Closing Content Slot: ${this.element.info.static.title}`,
          // value: this.element.info.static.hash,
        },
      });
      closeEvent.init();
    });
    this.slotWrapper.appendChild(closeButton);

    if (this.structure.length >= 1) {
      let slotLayoutElements = '';

      this.structure.forEach((structureEntry, index) => {
        const slotLayoutSection = new SlotLayoutSection({
          element: this.element,
          article: this.article,
          index,
          selector: structureEntry.selector,
          type: structureEntry.type,
          start: structureEntry.start,
          span: structureEntry.span,
        });
        slotLayoutElements += slotLayoutSection.init();
      });
      this.insertContent(slotLayoutElements);
    } else {
      // console.log('No Structure to Render...');
    }
  }

  insertContent(elements) {
    const slotContent = document.createElement('section');
    slotContent.classList.add(`${CLASSNAME_CONTENTSLOT}__content`);
    slotContent.classList.add('grid--slot');
    slotContent.innerHTML = elements;

    this.slotWrapper.appendChild(slotContent);
    console.log('Insert Content', slotContent);
    this.initSliders();
    this.initTags();
  }

  initSliders() {
    this.sliders = document.querySelectorAll('[data-slider="true"]');
    // console.log('Init after Content Slot: ', this.sliders);
    this.sliders.forEach((slider) => {
      if (slider.innerHTML.length >= 0) {
        // console.log('Slider: ', slider, 'Slider innerHTML: ', slider.length);
        const sliderInstance = new ContentSlider({
          element: slider,
        });
        sliderInstance.init();
      }
    });
  }

  initTags() {
    this.tags = document.querySelectorAll('.tag-pill');
    arrayFrom(this.tags).forEach((tag) => {
      tag.addEventListener('click', () => {
        const newContentOverview = new ContentOverview({ element: document.querySelector('.mod--content-overview') });
        newContentOverview.init();

        const queryHandler = new QueryHandler({
          page: undefined,
          id: undefined,
          tag: tag.innerText.toLowerCase(),
        });
        queryHandler.init();
        this.closeSlot();

      });
    });
  }
}

export default ContentSlot;
