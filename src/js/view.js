import _ from 'lodash';
import $ from 'jquery';
import Base from './base';
import Model from './model';

const CELL_GAP = 3;
const CELL_SIZE = 12;
const CELL_OFFSET = CELL_GAP + CELL_SIZE;

const COLOR_DEAD = 'rgba(255, 255, 255, 0.5)';
const COLOR_ALIVE = 'rgba(255, 255, 255, 1)';

// Private data store for View instances.
const store = new WeakMap();

export default class View extends Base {

  /**
   * Canvas view constructor.
   *
   * @constructor
   */
  constructor (...args) {
    super(args);

    store.set(this, {
      playing: false
    });

    this.bindMethods([
      'draw', 'handleClick', 'pause', 'play',
    ]);

    this.resize = _.throttle(this.resize, 500).bind(this);

    this.model = new Model();
    this.model.
      on('genocide', this.draw).
      on('populate', this.draw).
      on('randomize', this.draw).
      on('resize', this.draw).
      on('set-cell', this.draw).
      on('tick', this.draw);

    this.el = $('<canvas>', {'class': 'grid'}).
      on('click', this.handleClick).
      appendTo(document.body);

    this.context = this.el.get(0).getContext('2d');
    this.resize();
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

    if (row !== null && col !== null && !this.playing) {
      this.model.flipCell(row, col);
    }
  }

  /**
   * Draws the view to the rendering context.
   *
   * @method draw
   */
  draw () {
    const dimensions = this.getDimensions();
    const data = this.model.data();
    let y = CELL_GAP;

    this.context.clearRect(0, 0, dimensions.width, dimensions.height);

    for (let i = 0; i < data.length; i++) {
      let x = CELL_GAP;

      for (let j = 0; j < data[i].length; j++) {
        let type = data[i][j] ? 'fill' : 'stroke';

        this.context[type + 'Style'] = data[i][j] ? COLOR_ALIVE : COLOR_DEAD;
        this.context[type + 'Rect'](x, y, CELL_SIZE, CELL_SIZE);

        x += CELL_OFFSET;
      }

      y += CELL_OFFSET;
    }
  }

  /**
   * Resizes the grid.
   *
   * @method  resize
   */
  resize () {
    const dimensions = this.getDimensions();
    this.el.attr(dimensions);
    this.model.resize(
      Math.floor((dimensions.height - CELL_GAP) / CELL_OFFSET),
      Math.floor((dimensions.width - CELL_GAP) / CELL_OFFSET)
    );
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

  /**
   * Puts the view in a non-playing state.
   *
   * @method pause
   */
  pause () {
    this.playing = false;
  }

  /**
   * Puts the view in a playing state.
   *
   * @method play
   */
  play () {
    this.playing = true;
  }
}
