class AudioLoader {
  constructor(options = {}) {
    this.element = options.element;
    this.article = options.article;
    this.key = options.key;
    this.source = options.source;
    this.slotIndex = options.slotIndex;
    this.index = options.i + 1;
  }

  init() {
    if(this.key === 'audioFile') {
      return this.returnAudioTemplate(this.source[0]);
    } else if (this.key === 'audioLink') {
      return this.returnYoutubeEmbed(this.source[0].url);
    }
  }

  returnAudioTemplate(source) {
    let audioTemplate = `
      <figure>
        <audio src="https://res.cloudinary.com/richterskala/raw/upload/${this.article.info.static.title}/${this.article.info.static.hash}-${source.hash}.${source.extension}" controls>
          <p>Your browser does not support the audio element </p>
        </audio>
    `;

    audioTemplate += `
      <figcaption><strong>Ass.${this.slotIndex}.${this.index}${source.caption !== '' ? `: </strong>${source.caption}` : '</strong>'}</figcaption></figure>
    `;

    return audioTemplate;
  }

  returnYoutubeEmbed(link) {
    let youtubeEmbed = `
    <figure>
      <iframe width="560" height="315" src="${link}" frameborder="0"></iframe>
    `;

    youtubeEmbed += `
      <figcaption><strong>Ass.${this.slotIndex}.${this.index}</figcaption></figure>
    `;

    return youtubeEmbed;
  }
}

export default AudioLoader;
