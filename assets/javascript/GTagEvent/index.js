class GTagEvent {
  constructor(options = {}) {
    this.event = options.event;
  }

  init() {
    console.log(this.event.category);
    gtag('event', this.event.type, {
      'event_category': this.event.category,
      'event_action': this.event.action,
      'event_label': this.event.label,
    });
  }
}

export default GTagEvent;
