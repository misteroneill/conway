export default {

  /**
   * Create a DOM element.
   *
   * @param  {String} tagName
   * @param  {Object} attrs
   * @return {Element}
   */
  el (tagName, attrs) {
    return this.setAttrs(document.createElement(tagName), attrs);
  },

  /**
   * Set multiple attributes on a DOM element.
   *
   * @param {Element} el
   * @param {Object} attrs
   */
  setAttrs (el, attrs) {
    Object.keys(attrs).forEach(attr => el.setAttribute(attr, attrs[attr]));
    return el;
  }
};
