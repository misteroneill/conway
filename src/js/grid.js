import _ from 'lodash';
import dom from './lib/dom';

const CELL_GAP = 4;
const CELL_SIZE = 10;
const CELL_OFFSET = CELL_GAP + CELL_SIZE;

const COLOR_GRID = 'rgba(0, 0, 0, 1)';
const COLOR_CELL_DEAD = 'rgba(255, 255, 255, 0.5)';
const COLOR_CELL_ALIVE = 'rgba(255, 255, 255, 1)';

function resize() {
  const size = this.getSize();
  dom.setAttrs(this.el, size);
  this.adjustDataSize(size).draw();
}

export default class Grid {

  data() {
    if (!Array.isArray(this._data) || !Array.isArray(this._data[0])) {
      this._data = [[0]];
    }
    return this._data;
  }

  setup() {
    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');

    this.resize = _.throttle(resize, 500).bind(this);
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
    const size = this.getSize();

    this.context.fillStyle = COLOR_GRID;
    this.context.fillRect(0, 0, size.width, size.height);

    let y = CELL_GAP;

    this.data().forEach(function (row) {
      let x = CELL_GAP;

      row.forEach(function (cell) {
        let type = cell ? 'fill' : 'stroke';

        this.context[type + 'Style'] = cell ? COLOR_CELL_ALIVE : COLOR_CELL_DEAD;
        this.context[type + 'Rect'](x, y, CELL_SIZE, CELL_SIZE);

        x += CELL_OFFSET;
      }, this);

      y += CELL_OFFSET;
    }, this);

    return this;
  }

  getSize() {
    return {
      height: document.body.clientHeight,
      width: document.body.clientWidth
    };
  }

  adjustDataSize(size) {
    let data = this.data();

    let rowCountNew = Math.floor((size.height - CELL_GAP) / CELL_OFFSET);
    let rowCountOld = data.length;
    let rowDiff = rowCountNew - rowCountOld;
    let colCountNew = Math.floor((size.width - CELL_GAP) / CELL_OFFSET);
    let colCountOld = data[0].length;
    let colDiff = colCountNew - colCountOld;

    // Adding new row(s) of dead cells.
    if (rowDiff > 0) {
      for (let i = rowCountOld; i < rowCountNew; i++) {
        data[i] = _.fill(Array(colCountNew), 0);
      }

    // Removing old row(s).
    } else if (rowDiff < 0) {
      data.length += rowDiff;
    }

    // Adding or removing dead cells from existing row(s).
    if (colDiff !== 0) {
      for (let i = 0; i < Math.min(rowCountOld, data.length); i++) {
        if (colDiff > 0) {
          data[i] = data[i].concat(_.fill(Array(colDiff), 0));
        } else {
          data[i].length += colDiff;
        }
      }
    }

    return this;
  }
}
