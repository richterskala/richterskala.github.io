import { dispatchCustomEvent, getWindowSize } from '../helpers';
// import { CONFIG, BREAKPOINTS } from '../config';

const BREAKPOINTS = window.config.breakpoints;
const CONFIG = window.config;

let eventHandlerResize = null;

class ResizeHandler {
  constructor() {
    // resize
    this.timeResize = 70;
    this.timeoutResize = null;

    this.timeViewport = 70;
    this.timeoutViewport = null;

    // state
    this.currentViewport = null;
    this.currentViewportStage = null;
  }

  init() {
    // set initial viewport
    this.getCurrentViewport();

    // add handlers
    this.initEventResize();
  }


  /**
   * RESIZE EVENT
   */

  initEventResize() {
    window.addEventListener('resize', () => {
      // resize handling
      window.clearTimeout(this.timeoutResize);
      this.timeoutResize = window.setTimeout(
        () => this.handleEventResize(),
        this.timeResize,
      );

      // viewport change handling
      window.clearTimeout(this.timeoutViewport);
      this.timeoutViewport = window.setTimeout(
        () => this.handleEventViewportChangeWrapper(),
        this.timeViewport,
      );

    });
  }

  handleEventResize() {
    // define custom event for browser resize
    dispatchCustomEvent(
      CONFIG.events.resize,
      {},
    );
  }


  /**
   * VIEWPORT CHANGE
   */

  handleEventViewportChangeWrapper() {
    const windowWidth = getWindowSize().width;

    this.handleEventViewportChange(windowWidth);
  }

  handleEventViewportChange(windowWidth) {
    const viewportKey = this.checkViewport(windowWidth);

    // check if viewport changed
    if (viewportKey !== this.currentViewport) {
      this.currentViewport = viewportKey;

      // define custom event for viewport-change
      dispatchCustomEvent(
        CONFIG.events.viewportChange,
        {
          viewport: viewportKey,
          width: windowWidth,
        },
      );
    }
  }


  /**
   * HELPERS
   */

  checkViewport(windowWidth) {
    for (const viewport of BREAKPOINTS) {
      if (windowWidth <= viewport.width) {
        return viewport.name;
      }
    }
    return BREAKPOINTS.xlarge;
  }

  getCurrentViewport() {
    if (this.currentViewport === null) {
      // set initial viewport
      this.currentViewport = this.checkViewport(getWindowSize().width);
    }
    return this.currentViewport;
  }

  getCurrentViewportStage() {
    return this.checkViewport(getWindowSize().width);
  }

  getViewportInfo(currentViewport) {
    const checkViewport = currentViewport || this.getCurrentViewport();

    for (const viewport of BREAKPOINTS) {
      if (checkViewport === viewport.name) {
        return {
          viewport: viewport.name,
          width: viewport.width,
        };
      }
    }
    return null;
  }
}

// prepare singleton behavior
if (!eventHandlerResize) {
  eventHandlerResize = new ResizeHandler();
  eventHandlerResize.init();
}

export default () => eventHandlerResize;
