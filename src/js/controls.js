import _ from 'lodash';
import dom from './dom';

const delegations = new Map([
  ['.btn.toggler',     'handleToggler'],
  ['.btn.play',        'handlePlay'],
  ['.btn.randomize',   'handleRandomize'],
  ['.btn.genocide',    'handleGenocide'],
  ['.btn.speed-up',    'handleSpeedUp'],
  ['.btn.slow-down',   'handleSlowDown'],
  ['.btn.speed-reset', 'handleSpeedReset'],
]);

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
   */
  constructor (game) {
    this.game = game;

    this.el = dom.appendChildren(
      dom.el('div', {className: 'controls'}),
      this.createButton('toggler', {
        icon: 'cog',
        title: 'Settings'
      }),
      this.createButton('play', {
        icon: 'play',
        title: 'Play/Pause'
      }),
      dom.appendChildren(
        dom.el('div', {className: ['section', 'explanation']}),
        dom.el('h1', 'What is this?'),
        dom.appendChildren(
          dom.el('p'),
          dom.el('a', 'Conway\'s Game of Life', {href: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'}),
          document.createTextNode([
            ' is a cellular automation simulator. It is not a true "game"; ',
            'rather, the player sets up conditions for simulated life to ',
            'evolve and interesting patterns to be created.'
          ].join(''))
        )
      ),
      dom.appendChildren(
        dom.el('div', {className: ['section', 'population']}),
        dom.el('h1', 'Population'),
        this.createButton('randomize', {
          icon: 'random',
          text: 'Randomize',
          title: 'Populate the grid with a random assortment of living cells'
        }),
        this.createButton('genocide', {
          icon: 'fire',
          text: 'Genocide',
          title: 'Kill all living cells; reset the grid'
        })
      ),
      dom.appendChildren(
        dom.el('div', {className: ['section', 'speed']}),
        dom.el('h1', 'Speed'),
        this.createButton('speed-up', {
          icon: 'upload',
          title: 'Increase speed'
        }),
        this.createButton('speed-reset', {
          icon: 'refresh',
          title: 'Reset speed to default'
        }),
        this.createButton('slow-down', {
          icon: 'download',
          title: 'Reduce speed'
        })
      )
    );

    this.el.addEventListener('click', this.handleClick.bind(this));

    document.body.appendChild(this.el);
  }

  createButton (name, options) {
    let classes = ['btn', name];

    this.btns = this.btns || {};

    let btn = this.btns[name] = dom.el('span', {
      className: [
        'btn',
        name,
        options.icon && !options.text ? 'btn-icon' : '',
        options.text && !options.icon ? 'btn-text' : '',
        options.icon && options.text ? 'btn-icon-and-text' : '',
      ],
      title: options.title
    });

    if (options.icon) {
      let icon = dom.el('span', {
        className: ['glyphicon', `glyphicon-${options.icon}`]
      });
      btn.appendChild(icon);
    }

    if (options.text) {
      let text = dom.el('span', {className: 'text'});
      text.appendChild(document.createTextNode(options.text));
      btn.appendChild(text);
    }

    return btn;
  }

  handleClick (e) {
    e.preventDefault();
    e.stopPropagation();
    delegations.forEach((method, selector) => {
      let target = this.el.querySelector(selector);
      if (e.target === target || target.contains(e.target)) {
        this[method]();
      }
    }, this);
  }

  handleToggler () {
    this.el.classList.toggle('expanded');
    this.btns.toggler.firstChild.classList.toggle('glyphicon-cog');
    this.btns.toggler.firstChild.classList.toggle('glyphicon-remove');
  }

  handlePlay () {
    this.game.playing();
    this.btns.play.firstChild.classList.toggle('glyphicon-play');
    this.btns.play.firstChild.classList.toggle('glyphicon-pause');
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
