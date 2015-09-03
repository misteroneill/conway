import _ from 'lodash';
import $ from 'jquery';
import Base from './base';
import Controls from './controls';
import View from './view';

const DEFAULT_SPEED = 250;

// Private data store for Conway instances.
const store = new WeakMap();

class Conway extends Base {

  /**
   * Conway constructor.
   *
   * @constructor
   */
  constructor (...args) {
    super(args);

    let controls = new Controls();
    let view = new View();

    store.set(this, {
      controls: controls,
      model: view.model,
      view: view,
      playing: false,
      tick: {
        count: 0,
        speed: DEFAULT_SPEED,
        timestamp: 0,
      }
    });

    this.bindMethods([
      'genocide', 'pause', 'play', 'randomize',
      'speed', 'speedDown', 'speedUp', 'tick',
    ]);

    this.on('generation', controls.updateGenerationCount);

    controls.
      on('genocide', this.genocide).
      on('pause', this.pause).
      on('pause', view.pause).
      on('play', this.play).
      on('play', view.play).
      on('randomize', this.randomize).
      on('speed-down', this.speedDown).
      on('speed-reset', this.speed).
      on('speed-up', this.speedUp);

    $(window).on('resize', view.resize);
  }

  /**
   * Get/set the generation count.
   *
   * @param  {Number} [i]
   * @return {Number}
   */
  generation (i) {
    let tick = store.get(this).tick;
    if (_.isFinite(i) && i >= 0) {
      tick.count = i;
      this.emit('generation', i);
    }
    return tick.count;
  }

  /**
   * Stops the tick.
   *
   * @method pause
   */
  pause () {
    store.get(this).playing = false;
  }

  /**
   * Starts the tick.
   *
   * @method play
   */
  play () {
    store.get(this).playing = true;
  }

  /**
   * Kills all cells.
   *
   * @method genocide
   */
  genocide (...args) {
    this.generation(0);
    store.get(this).model.genocide(...args);
  }

  /**
   * Randomizes all cells with an optional weight.
   *
   * @method randomize
   * @param  {Number} [weight]
   *         A number from zero to one, representing the ratio of living cells.
   */
  randomize (...args) {
    this.generation(0);
    store.get(this).model.randomize(...args);
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
    let tick = store.get(this).tick;
    tick.speed -= tick.speed < ms ? tick.speed : ms;
  }

  /**
   * Decreases the speed of generation by a given number of milliseconds.
   *
   * @param {Number} [ms]
   */
  speedDown (ms) {
    store.get(this).tick.speed += ms;
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
      data.tick.timestamp = timestamp;
      data.model.tick();
      this.generation(data.tick.count + 1);
    }
    window.requestAnimationFrame(this.tick);
  }
};

window.conway = new Conway();
window.conway.tick();
