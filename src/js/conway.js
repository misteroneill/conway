import _ from 'lodash';
import GridView from './grid-view';

const DEFAULT_SPEED = 500;

class Conway {

  /**
   * Conway constructor.
   *
   * @constructor
   * @param       {Number} speed
   */
  constructor (speed) {
    this.grid = new GridView();
    this._playing = false;
    this._tick = {
      count: 0,
      speed: speed || DEFAULT_SPEED,
      timestamp: 0,
    };
    window.addEventListener('resize', this.grid.resize);
  }

  /**
   * Toggles whether or not the game is playing.
   *
   * @method  togglePlaying
   */
  playing () {
    this._playing = !this._playing;
  }

  /**
   * Kills all cells.
   *
   * @method genocide
   */
  genocide (...args) {
    this.grid.model.genocide(...args);
    this.grid.draw();
  }

  /**
   * Randomizes all cells with an optional weight.
   *
   * @method randomize
   * @param  {Number} [weight]
   *         A number from zero to one, representing the ratio of living cells.
   */
  randomize (...args) {
    this.grid.model.randomize(...args);
    this.grid.draw();
  }

  /**
   * Set the speed of the ticks in milliseconds.
   *
   * @param  {Number} [ms]
   *         Finite number of milliseconds above zero
   */
  speed (ms) {
    if (ms && _.isFinite(ms)) {
      this._tick.speed = ms;
    }
  }

  /**
   * Function which runs as a callback to requestAnimationFrame and drives
   * the progress of the game.
   *
   * @method  tick
   * @param   {NUmber} timestamp
   */
  tick (timestamp) {
    if (this._playing && timestamp - this._tick.timestamp >= this._tick.speed) {
      this._tick.count++;
      this.grid.model.tick();
      this.grid.draw();
      this._tick.timestamp = timestamp;
    }
    window.requestAnimationFrame(this.tick.bind(this));
  }
};

window.conway = new Conway();
window.conway.tick();
