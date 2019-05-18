import CustomEvent from 'custom-event';

function dispatchCustomEvent(eventType, payload) {
  const customEvent = new CustomEvent(
    eventType,
    { detail: payload },
  );

  // dispatch event for project
  window.dispatchEvent(customEvent);
}

function getWindowSize() {
  /**
   * Returns current window size.
   * (grab the correct inner size without scrollbar)
   *
   * @return {Object} with 'width' and 'height' of window
   *  - width
   *  - height
   */

  /*
  let v = window;
  let a = 'inner';

  if (!('innerWidth' in v)) {
    a = 'client';
    v = document.documentElement || document.body;
  }

  return {
    width: v[`${a}Width`],
    height: v[`${a}Height`],
  };
  */

  const v = document.documentElement || document.body;
  return {
    width: v.clientWidth,
    height: v.clientHeight,
  };
}

export {
  dispatchCustomEvent,
  getWindowSize,
}
