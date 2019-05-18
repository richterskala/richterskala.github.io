import 'lazysizes';

const BREAKPOINTS = window.config.breakpoints;

class ImageLoader {
  constructor(options = {}) {
    this.element = options.element;
    this.article = options.article;
    this.slotIndex = options.slotIndex;
    this.index = options.i + 1;
    this.imgConfig = {
      testUrl: 'https://res.cloudinary.com/richterskala/image/upload/c_scale,e_blur_faces:2000,h_150,w_200/v1553697105/samples/people/boy-snow-hoodie.jpg',
      baseUrl: 'https://res.cloudinary.com/richterskala/image/upload/',
      defaults: {
        height: 1000,
        width: 1500,
        blur: 2000,
      },
      imgCommands: {
        scale: 'c_fit,',
        blur_faces: 'e_blur_faces',
        blur: 'e_blur',
        height: 'h_',
        width: 'w_',
      },
      imgWidths: {
        small: 400,
        medium: 750,
        large: 2000,
      },
    };
  }

  init() {
    // console.log('New Image Loader with: ', this.element, this.index);
  }

  renderThumbTemplate(src) {
    const template = `
      <figure class="mod--content-overview__item__thumb">
        <img src="${this.returnImgPath(this.article.info.static.title+'/'+this.article.info.static.hash+'-'+src.hash, 400, 400, src.extension, 40000, true)}" />
      </figure>
    `
    return template;
  }

  renderSrcSet(src) {
    // console.log('New Image Loader with: ', this.element, this.index);

    let figureTemplate = '<figure>';
    const name = `${this.article.info.static.title}/${this.article.info.static.hash}-${src.hash}`;
    let srcSetTemplate = '<picture class="content-overview__item__srcset__picture">';

    Object.values(BREAKPOINTS).forEach((breakpoint) => {
      // console.log(breakpoint, breakpoint.width, Number(breakpoint.width));
      srcSetTemplate += `
        <source
          media="(max-width: ${breakpoint.width}px)"
          srcset="
            ${this.returnImgPath(name, Number(Math.min(3000, breakpoint.width)), Number(Math.min(3000, breakpoint.width)), src.extension, 0)} 1x,
            ${this.returnImgPath(name, Number(Math.min(3000, breakpoint.width * 2)), Number(Math.min(3000, breakpoint.width * 2)), src.extension, 0)} 2x
          "
        />
      `;
    });

    srcSetTemplate += `
      <img class="lazyload" data-src="${this.returnImgPath(name, 1000, 1000, src.extension, 0)}" src="${this.returnImgPath(name, 1000, 1000, src.extension, 0)}" ${src.caption !== '' ? `alt="${src.caption}"` : ''}/>
      <div class="lazyload__placeholder"></div>
    `;
    // oncontextmenu="alert('Nix da Brudi!'); return false;"
    srcSetTemplate += '</picture>';

    figureTemplate += srcSetTemplate;

    figureTemplate += `
      <figcaption><strong>Ass.${this.slotIndex}.${this.index}${src.caption !== '' ? `: </strong>${src.caption}` : '</strong>'}</figcaption>
    `;

    figureTemplate += '</figure>';
    // console.log('SRCSET TEMPLATE: ', srcSetTemplate);
    return figureTemplate;
  }

  returnImgPath(name, height = this.imgConfig.defaults.height, width = this.imgConfig.defaults.width, extension, blur = this.imgConfig.defaults.blur, greyscale = false) {
    let greyscaleTemplate = '';

    if (greyscale === true) {
      greyscaleTemplate = 'e_grayscale/';
    }
    const con = this.imgConfig;
    const com = con.imgCommands;
    return `${con.baseUrl}${greyscaleTemplate}${com.scale}${com.blur}:${blur},${com.blur_faces}:${blur},${com.height}${height},${com.width}${width}/${name}.${extension}`
  }
}

export default ImageLoader;
