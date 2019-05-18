class VideoLoader {
  constructor(options = {}) {
    this.element = options.element;
    this.article = options.article;
    this.key = options.key;
    this.source = options.source;
    this.slotIndex = options.slotIndex;
    this.index = options.i + 1;
  }

  init() {
    if (this.key.includes('File')) {
      return this.returnVideoTemplate(this.element);
    } else if (this.key.includes('Link')) {
      return this.returnVimeoEmbed(this.element.url);
    }
  }

  returnVideoTemplate(source) {
    let videoTemplate = `
      <figure>
        <video controls="controls" height="360" loop poster="https://res.cloudinary.com/richterskala/image/upload/${this.article.info.static.title}/${this.article.info.static.hash}-${source.poster.hash}.${source.poster.extension}" preload="none" style="margin: 0 auto;display: block" width="640">
          <source src="https://res.cloudinary.com/richterskala/raw/upload/${this.article.info.static.title}/${this.article.info.static.hash}-${source.hash}.${source.extension}" type="video/${source.extension}" />
        </video>
    `;

    videoTemplate += `
      <figcaption><strong>Ass.${this.slotIndex}.${this.index}${source.caption !== '' ? `: </strong>${source.caption}` : '</strong>'}</figcaption></figure>
    `;

    return videoTemplate;
  }

  returnVimeoEmbed(link) {
    let youtubeEmbed = `
      <figure>
        <iframe src="${link}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    `;

    youtubeEmbed += `
      <figcaption><strong>Ass.${this.slotIndex}.${this.index}${link.caption !== undefined ? `: </strong>${link.caption}` : '</strong>'}</figcaption></figure>
    `;

    return youtubeEmbed;
  }


}

export default VideoLoader;
