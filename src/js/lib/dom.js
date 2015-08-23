export default {

  /**
   * Set multiple attributes on a DOM element.
   *
   * @param {Element} el
   * @param {Object} attrs
   */
  setAttrs(el, attrs) {
    Object.keys(attrs).forEach(attr => el.setAttribute(attr, attrs[attr]));
    return el;
  }
};
