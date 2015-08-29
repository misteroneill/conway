import _ from 'lodash';
import Controls from './controls';
import View from './view';

const DEFAULT_SPEED = 250;

// Private data store for Conway instances.
const store = new WeakMap();

class Conway {

  /**
   * Conway constructor.
   *
   * @constructor
   */
  constructor () {
    let controls = new Controls(this);
    let view = new View();

    store.set(this, {
      controls: controls,
      view: view,
      playing: false,
      tick: {
        count: 0,
        speed: DEFAULT_SPEED,
        timestamp: 0,
      }
    });

    this.tick = this.tick.bind(this);

    window.addEventListener('resize', view.resize);
  }

  /**
   * Toggles whether or not the game is playing.
   *
   * @method  togglePlaying
   */
  playing () {
    let data = store.get(this);
    data.playing = !data.playing;
  }

  /**
   * Kills all cells.
   *
   * @method genocide
   */
  genocide (...args) {
    let view = store.get(this).view;
    view.model.genocide(...args);
    view.draw();
  }

  /**
   * Randomizes all cells with an optional weight.
   *
   * @method randomize
   * @param  {Number} [weight]
   *         A number from zero to one, representing the ratio of living cells.
   */
  randomize (...args) {
    let view = store.get(this).view;
    view.model.randomize(...args);
    view.draw();
  }

  /**
   * Set the speed of the ticks in milliseconds.
   *
   * @param  {Number} [ms]
   *         Finite number of milliseconds above zero. If not given (or an
   *         otherwise invalid value), the internal value is set back to the
   *         default.
   */
  speed (ms) {
    store.get(this).tick.speed = (ms > 0 && _.isFinite(ms)) ? ms : DEFAULT_SPEED;
  }

  /**
   * Increases the speed of generation by a given number of milliseconds.
   *
   * @param {Number} [ms]
   */
  speedUp (ms) {
    let speed = store.get(this).tick.speed;
    store.get(this).tick.speed -= speed < ms ? speed : ms;
  }

  /**
   * Decreases the speed of generation by a given number of milliseconds.
   *
   * @param {Number} [ms]
   */
  slowDown (ms) {
    store.get(this).tick.speed += ms;
  }

  /**
   * Retrieve a count of generations passed so far.
   *
   * @return {Number}
   */
  generations () {
    return store.get(this).tick.count;
  }

  /**
   * Function which runs as a callback to requestAnimationFrame and drives
   * the progress of the game.
   *
   * @method  tick
   * @param   {NUmber} timestamp
   */
  tick (timestamp) {
    let data = store.get(this);
    if (data.playing && timestamp - data.tick.timestamp >= data.tick.speed) {
      data.tick.count++;
      data.controls.updateGeneration();
      data.view.model.tick();
      data.view.draw();
      data.tick.timestamp = timestamp;
    }
    window.requestAnimationFrame(this.tick);
  }
};

window.conway = new Conway();
window.conway.tick();
