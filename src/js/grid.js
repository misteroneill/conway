import _ from 'lodash';
import dom from './lib/dom';

const CELL_GAP = 4;
const CELL_SIZE = 10;
const CELL_OFFSET = CELL_GAP + CELL_SIZE;

const COLOR_GRID = 'rgba(0, 0, 0, 1)';
const COLOR_CELL_DEAD = 'rgba(255, 255, 255, 0.333)';
const COLOR_CELL_ALIVE = 'rgba(255, 255, 255, 1)';

export default class Grid {

  constructor() {
    this._data = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  setup() {
    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');

    this.resize = _.throttle(function resize() {
      dom.setAttrs(this.el, this.getSize());
      this.draw();
    }, 250).bind(this);

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
    let size = this.getSize();

    this.context.fillStyle = COLOR_GRID;
    this.context.fillRect(0, 0, size.width, size.height);

    let y = CELL_GAP;

    this._data.forEach(function (row) {
      let x = CELL_GAP;

      row.forEach(function (cell) {
        let type = cell ? 'fill' : 'stroke';

        this.context[type + 'Style'] = cell ? COLOR_CELL_ALIVE : COLOR_CELL_DEAD;
        this.context[type + 'Rect'](x, y, CELL_SIZE, CELL_SIZE);

        x += CELL_SIZE + CELL_GAP;
      }, this);

      y += CELL_SIZE + CELL_GAP;
    }, this);

    return this;
  }

  getSize() {
    return {
      height: document.body.clientHeight,
      width: document.body.clientWidth
    };
  }
}
