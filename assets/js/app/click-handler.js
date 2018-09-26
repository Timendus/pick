/**
 * Okay, so why do we need this? Why a whole class to implement our own version
 * of click handling? Am I insane?
 *
 * Well, maybe, but not because of this.
 *
 * This class installs one single click handler on the whole document, and
 * evaluates which callback to call at click time, based on the element that has
 * been clicked. This allows us to swap out and rerender whole sections of the
 * DOM without having to reinstall a bunch of click handlers each time. This
 * nicely decouples the render logic from the click event management logic.
 */

class ClickHandler {

  constructor() {
    document.addEventListener('click', (e) => this.handleClick(e));
    this.handlers = {};
  }

  handleClick(e) {
    Object.keys(this.handlers).forEach((selector) => {
      if (e.target.matches(selector)) {
        this.handlers[selector](e.target);
      }
    });
  }

  register(selector, callback) {
    this.handlers[selector] = callback;
  }

}
