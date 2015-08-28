import _ from 'lodash';
import dom from './lib/dom';
import GridModel from './grid-model';

const CELL_GAP = 3;
const CELL_SIZE = 12;
const CELL_OFFSET = CELL_GAP + CELL_SIZE;

const COLOR_GRID = 'rgba(0, 0, 0, 1)';
const COLOR_CELL_DEAD = 'rgba(255, 255, 255, 0.5)';
const COLOR_CELL_ALIVE = 'rgba(255, 255, 255, 1)';

/**
 * Base function used to generate throttled resize handlers.
 *
 */
function resize() {
  const dimensions = this.getDimensions();
  dom.attrs(this.el, dimensions);
  this.model.resize(
    Math.floor((dimensions.height - CELL_GAP) / CELL_OFFSET),
    Math.floor((dimensions.width - CELL_GAP) / CELL_OFFSET)
  );
  this.draw();
}

export default class GridView {

  /**
   * Canvas view constructor.
   *
   * @constructor
   */
  constructor () {
    this.model = new GridModel();
    this.el = dom.el('canvas', {'class': 'grid'});
    this.el.addEventListener('click', this.handleClick.bind(this));
    this.context = this.el.getContext('2d');
    this.resize = _.throttle(resize, 500).bind(this);
    this.resize();
    document.body.appendChild(this.el);
  }

  /**
   * Event handler for clicks on the canvas.
   *
   * @method handleClick
   * @param  {Event} e
   */
  handleClick (e) {
    let row = Math.floor((e.clientY - CELL_GAP) / CELL_OFFSET);
    let col = Math.floor((e.clientX - CELL_GAP) / CELL_OFFSET);

    if (row !== null && col !== null) {
      this.model.flipCell(row, col);
      this.draw();
    }
  }

  /**
   * Draws the view to the rendering context.
   *
   * @method draw
   */
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

  /**
   * Get the full dimensions of view.
   *
   * @method  getDimensions
   * @return  {Object}
   */
  getDimensions () {
    return {
      height: document.body.clientHeight,
      width: document.body.clientWidth
    };
  }
}
