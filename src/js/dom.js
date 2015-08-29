import _ from 'lodash';

export default {

  /**
   * Create a DOM element.
   *
   * @param  {String} tagName
   * @param  {Object} [attrs]
   * @param  {String} [text]
   * @return {Element}
   */
  el (tagName, ...rest) {
    let el = document.createElement(tagName);
    let attrs, text;

    rest.forEach(value => {
      if (_.isObject(value)) {
        attrs = value;
      } else if (_.isString(value) && value.length) {
        text = value;
      }
    });

    if (attrs) {
      el = this.attrs(el, attrs);
    }

    if (text) {
      el.appendChild(document.createTextNode(text));
    }

    return el;
  },

  /**
   * Append multiple children to a DOM element.
   *
   * @param  {Element} el
   * @param  {Element} [...children]
   * @return {Element}
   */
  appendChildren (el, ...children) {
    children.forEach(child => el.appendChild(child));
    return el;
  },

  /**
   * Set multiple attributes on a DOM element.
   *
   * @param {Element} el
   * @param {Object} attrs
   */
  attrs (el, attrs) {
    if (_.isObject(attrs)) {
      Object.keys(attrs).forEach(key => {
        let value = attrs[key];
        if (key === 'class' || key === 'className') {
          key = 'class';
          if (Array.isArray(value)) {
            value = value.filter(_.identity).join(' ');
          }
        }
        el.setAttribute(key, value);
      });
    }
    return el;
  }
};
