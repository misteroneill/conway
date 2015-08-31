import _ from 'lodash';
import $ from 'jquery';

/**
 * A UI element that allows the user to control the evolution.
 *
 * @class Controls
 */
export default class Controls {

  /**
   * Controls constructor.
   *
   * @constructor
   * @param {Conway} game
   */
  constructor (game) {
    this.game = game;

    this.el = $('<div>', {'class': 'controls'}).
      append(this.createButton('toggler', {
        icon: 'cog',
        title: 'Settings'
      })).
      append(this.createButton('play', {
        icon: 'play',
        title: 'Play/Pause'
      })).
      append(`
        <div class="section explanation">
          <h1>What is this?</h1>
          <p>
            <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
            Conway's Game of Life</a> is a cellular automaton. It is not a
            "game" in the usual sense; rather, the player sets up initial
            conditions for simulated life to evolve and lets the automaton take
            over.
          </p>
          <p>
            Click the squares to toggle their state - or choose predefined
            states using the controls below.
          </p>
        </div>
        <div class="section generations">
          <h1>Generations</h1>
          <span class="generation-count">0</span>
        </div>
        <div class="section population">
          <h1>Population</h1>
        </div>
        <div class="section speed">
          <h1>Speed</h1>
        </div>
      `).
      find('.population').
      append(this.createButton('randomize', {
        icon: 'random',
        text: 'Randomize',
        title: 'Populate the grid with a random assortment of living cells'
      })).
      append(this.createButton('genocide', {
        icon: 'fire',
        text: 'Genocide',
        title: 'Kill all living cells; reset the grid'
      })).
      end().
      find('.speed').
      append(this.createButton('speed-up', {
        icon: 'upload',
        title: 'Increase speed'
      })).
      append(this.createButton('speed-reset', {
        icon: 'refresh',
        title: 'Reset speed to default'
      })).
      append(this.createButton('slow-down', {
        icon: 'download',
        title: 'Reduce speed'
      })).
      end().
      on('click', '.btn.toggler', this.handleToggler.bind(this)).
      on('click', '.btn.play', this.handlePlay.bind(this)).
      on('click', '.btn.randomize', this.handleRandomize.bind(this)).
      on('click', '.btn.genocide', this.handleGenocide.bind(this)).
      on('click', '.btn.speed-up', this.handleSpeedUp.bind(this)).
      on('click', '.btn.slow-down', this.handleSlowDown.bind(this)).
      on('click', '.btn.speed-reset', this.handleSpeedReset.bind(this)).
      appendTo(document.body);
  }

  /**
   * Creates a button element with some common conventions.
   *
   * @param  {String} name
   * @param  {Object} options
   * @return {jQuery}
   */
  createButton (name, options) {
    this.btns = this.btns || {};

    this.btns[name] = $('<span>', {
      'class': [
        'btn',
        name,
        options.icon && !options.text ? 'btn-icon' : '',
        options.text && !options.icon ? 'btn-text' : '',
        options.icon && options.text ? 'btn-icon-and-text' : '',
      ].filter(_.identity).join(' '),
      title: options.title || ''
    });

    if (options.icon) {
      this.btns[name].append($('<span>', {
        'class': ['glyphicon', `glyphicon-${options.icon}`].join(' ')
      }));
    }

    if (options.text) {
      this.btns[name].append($('<span>', {'class': 'text'}).text(options.text));
    }

    return this.btns[name];
  }

  updateGeneration () {
    this.el.find('.generation-count').text(this.game.generations());
  }

  handleToggler () {
    this.el.toggleClass('expanded');
    this.btns.toggler.find('.glyphicon').toggleClass('glyphicon-cog');
    this.btns.toggler.find('.glyphicon').toggleClass('glyphicon-remove');
  }

  handlePlay () {
    this.game.playing();
    this.btns.play.find('.glyphicon').toggleClass('glyphicon-play');
    this.btns.play.find('.glyphicon').toggleClass('glyphicon-pause');
  }

  handleRandomize () {
    this.game.randomize();
  }

  handleGenocide () {
    this.game.genocide();
  }

  handleSpeedUp () {
    this.game.speedUp(75);
  }

  handleSlowDown () {
    this.game.slowDown(75);
  }

  handleSpeedReset () {
    this.game.speed();
  }
}
