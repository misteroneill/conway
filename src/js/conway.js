import GridView from './grid-view';

class Conway {

  /**
   * Conway constructor.
   *
   * @constructor
   * @param       {Number} speed
   */
  constructor (speed) {
    this.grid = new GridView();
    this._tick = {
      count: 0,
      speed: speed || 500,
      timestamp: 0,
    };
    window.addEventListener('resize', this.grid.resize);
  }

  /**
   * Function which runs as a callback to requestAnimationFrame and drives
   * the progress of the game.
   *
   * @method  tick
   * @param   {NUmber} timestamp
   */
  tick (timestamp) {
    if (timestamp - this._tick.timestamp >= this._tick.speed) {
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
