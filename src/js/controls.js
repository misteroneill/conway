import _ from 'lodash';
import $ from 'jquery';
import Base from './base';

const SPEED_INCREMENT = 75;

/**
 * A UI element that allows the user to control the evolution.
 *
 * @class Controls
 */
export default class Controls extends Base {

  /**
   * Controls constructor.
   *
   * @constructor
   */
  constructor (...args) {
    super(args);

    this.bindMethods([
      'handleExplanation', 'handleGenocide', 'handlePlayPause',
      'handleRandomize', 'handleSpeedDown', 'handleSpeedReset',
      'handleSpeedUp', 'handleToggler', 'updateGenerationCount',
    ]);

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
          <h1><a class="explanation-toggle" href="#" data-target=".explanation .content">What is this?</a></h1>
          <div class="content hidden">
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
      append(this.createButton('speed-down', {
        icon: 'download',
        title: 'Reduce speed'
      })).
      end().
      on('click', '.explanation-toggle', this.handleExplanation).
      on('click', '.btn.genocide', this.handleGenocide).
      on('click', '.btn.play', this.handlePlayPause).
      on('click', '.btn.randomize', this.handleRandomize).
      on('click', '.btn.speed-down', this.handleSpeedDown).
      on('click', '.btn.speed-reset', this.handleSpeedReset).
      on('click', '.btn.speed-up', this.handleSpeedUp).
      on('click', '.btn.toggler', this.handleToggler).
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
      role: 'button',
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

  updateGenerationCount (count) {
    this.el.find('.generation-count').text(count);
  }

  handleExplanation (e) {
    e.preventDefault();
    this.el.find($(e.currentTarget).data('target')).toggleClass('hidden');
  }

  handleToggler () {
    this.el.toggleClass('expanded');
    this.btns.toggler.find('.glyphicon').
      toggleClass('glyphicon-cog glyphicon-remove');
  }

  handlePlayPause () {
    let icon = this.btns.play.find('.glyphicon');
    if (icon.hasClass('glyphicon-play')) {
      icon.removeClass('glyphicon-play');
      icon.addClass('glyphicon-pause');
      this.emit('play');
    } else {
      icon.addClass('glyphicon-play');
      icon.removeClass('glyphicon-pause');
      this.emit('pause');
    }
  }

  handleRandomize () {
    this.emit('randomize');
  }

  handleGenocide () {
    this.emit('genocide');
  }

  handleSpeedUp () {
    this.emit('speed-up', SPEED_INCREMENT);
  }

  handleSpeedDown () {
    this.emit('speed-down', -SPEED_INCREMENT);
  }

  handleSpeedReset () {
    this.emit('speed-reset');
  }
}
