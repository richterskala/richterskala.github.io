import arrayFrom from 'array-from';
import ImageLoader from '../ImageLoader';
import VideoLoader from '../VideoLoader';
import AudioLoader from '../AudioLoader';
import TagPill from '../TagPill';
// import ContentSlider from '../ContentSlider';

const CLASSNAME_CONTENTSLOT = 'mod--content-slot';

class SlotLayoutSection {
  constructor(options = {}) {
    this.element = options.element;
    this.article = options.article;
    this.index = options.index + 1;
    this.selector = options.selector;
    this.type = options.type;
    this.start = options.start || null;
    this.span = options.span || null;
    this.imageResource = null;
    this.slotLayoutSectionTemplate = '';
    this.slotLayoutSection = '';
    this.isSlider = this.element;
  }

  init() {
    // console.log('SlotLayoutSection: ', this.element, this.index);
    this.checkForType();

    return this.slotLayoutSection;
  }

  checkForType() {
    if (this.type === 'image') {
      this.renderImageContent();
    } else if (this.type === 'video') {
      this.renderVideoContent();
    } else if (this.type === 'meta') {
      this.renderMetaContent();
    } else if (this.type === 'audio') {
      this.renderAudioContent();
    } else if (this.type === 'quote') {
      this.renderQuoteContent();
    } else {
      this.renderTextContent();
    }
  }

  renderImageContent() {
    this.imageResource = this.element.media.images[this.selector].entries || null;

    this.imageResource.forEach((image, i) => {
      const imageLoader = new ImageLoader({
        element: image,
        article: this.element,
        slotIndex: this.index,
        i,
      });
      this.slotLayoutSectionTemplate += imageLoader.renderSrcSet(image);
    });
    // console.log('Image Resource: ', this.imageResource, 'Slider Toggle: ', this.element.media.images[this.selector].options.slider);
    if (this.element.media.images[this.selector].options.slider === 'true') {
      this.isSlider = true;
    }
    this.returnLayout();
  }

  renderVideoContent() {
    this.videos = this.element.media.videos;
    if (this.videos[this.selector]) {
      this.videos[this.selector].forEach((videoSource, i) => {
        let template = '';

        const videoLoader = new VideoLoader({
          element: videoSource,
          article: this.article,
          key: this.selector,
          slotIndex: this.index,
          i,
          // source: source
        });

        template += videoLoader.init();
        this.slotLayoutSectionTemplate += template;
      });
      this.returnLayout();
    }


  }

  renderMetaContent() {
    this.meta = this.element.info.meta;

    let tagListTemplate = `<ul class="${CLASSNAME_CONTENTSLOT}__tags">`;
    arrayFrom(this.meta.tags.split(',')).forEach((tag) => {
      tagListTemplate += new TagPill({ tag }).init();
    });
    tagListTemplate += '</ul>';

    this.slotLayoutSectionTemplate += tagListTemplate;
    this.returnLayout();
  }

  renderAudioContent() {
    this.audios = this.element.media.audios;

    Object.entries(this.audios).forEach((audio, i) => {
      const [key, source] = audio;
      const audioLoader = new AudioLoader({
        element: audio,
        article: this.article,
        key,
        source,
        slotIndex: this.index,
        i,
      });

      this.slotLayoutSectionTemplate += audioLoader.init();
    });

    this.returnLayout();
  }


  renderQuoteContent() {
    this.quote = this.element.info.quote;
    const quoteTemplate = `
      <div class="text">
        <blockquote class="quote">${this.quote.text}</blockquote>
        <cite class="cite">${this.quote.author}</cite>
      </div>
    `;

    this.slotLayoutSectionTemplate += quoteTemplate;
    this.returnLayout();
  }

  renderTextContent() {
    this.text = this.element.info.additionals;

    const textTemplate = `
      <div class="text">
        ${this.text.description}
      </div>
    `;

    this.slotLayoutSectionTemplate += textTemplate;
    this.returnLayout();
  }

  returnLayout() {
    this.slotLayoutSection = `
      <section class="${CLASSNAME_CONTENTSLOT}__section--${this.selector} grid-column-start--${this.start} grid-column-span--${this.span}" ${this.isSlider === true ? 'data-slider="true"' : ''}>
        <div class="${CLASSNAME_CONTENTSLOT}__section--${this.selector}__holder content-area">
    `;
    this.slotLayoutSection += `
      <div class="${CLASSNAME_CONTENTSLOT}__section--${this.selector}__holder__counter">
        ${this.index}
      </div>
    `;
    this.slotLayoutSection += this.slotLayoutSectionTemplate;
    this.slotLayoutSection += '</div></section>';

    return this.slotLayoutSection;
  }
}

export default SlotLayoutSection;
