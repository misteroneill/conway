import _ from 'lodash';
import dom from './lib/dom';
import GridModel from './grid-model';

const CELL_GAP = 4;
const CELL_SIZE = 12;
const CELL_OFFSET = CELL_GAP + CELL_SIZE;

const COLOR_GRID = 'rgba(0, 0, 0, 1)';
const COLOR_CELL_DEAD = 'rgba(255, 255, 255, 0.5)';
const COLOR_CELL_ALIVE = 'rgba(255, 255, 255, 1)';

function resize() {
  const dimensions = this.getDimensions();
  dom.setAttrs(this.el, dimensions);
  this.model.resize(
    Math.floor((dimensions.height - CELL_GAP) / CELL_OFFSET),
    Math.floor((dimensions.width - CELL_GAP) / CELL_OFFSET)
  );
  this.draw();
}

export default class GridView {

  constructor () {
    this.model = new GridModel();
  }

  setup () {
    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');
    this.resize = _.throttle(resize, 500).bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
    document.body.appendChild(this.el);
  }

  teardown () {
    document.body.removeChild(this.el);
    window.removeEventListener('resize', this.resize);
    this.el = this.resize = null;
  }

  draw () {
    const dimensions = this.getDimensions();

    this.context.fillStyle = COLOR_GRID;
    this.context.fillRect(0, 0, dimensions.width, dimensions.height);

    let y = CELL_GAP;

    this.model.data().forEach(function (row) {
      let x = CELL_GAP;

      row.forEach(function (cell) {
        let type = cell ? 'fill' : 'stroke';

        this.context[type + 'Style'] = cell ? COLOR_CELL_ALIVE : COLOR_CELL_DEAD;
        this.context[type + 'Rect'](x, y, CELL_SIZE, CELL_SIZE);

        x += CELL_OFFSET;
      }, this);

      y += CELL_OFFSET;
    }, this);
  }

  getDimensions () {
    return {
      height: document.body.clientHeight,
      width: document.body.clientWidth
    };
  }
}
