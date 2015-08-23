import _ from 'lodash';
import dom from './lib/dom';

function getSize() {
  return {
    height: document.body.clientHeight,
    width: document.body.clientWidth
  };
}

function resize() {
  dom.setAttrs(this.el, getSize());
  this.draw();
}

export default class Canvas {

  setup() {
    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');

    this.resize = _.throttle(resize, 16).bind(this);
    this.resize();
    window.addEventListener('resize', this.resize);

    this.attach();
    return this;
  }

  teardown() {
    this.detach();
    window.removeEventListener('resize', this.resize);
    this.el = this.resize = null;
    return this;
  }

  attach() {
    document.body.appendChild(this.el);
    this.resize();
    return this;
  }

  detach() {
    document.body.removeChild(this.el);
    return this;
  }

  draw() {
    let size = getSize();

    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillRect(0, 0, size.width, size.height);

  }
}
