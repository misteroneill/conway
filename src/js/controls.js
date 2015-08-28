import _ from 'lodash';
import dom from './lib/dom';

const delegations = new Map([
  ['.btn.toggler', 'handleToggler'],
  ['.btn.play',    'handlePlay'],
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
    this.el = dom.el('div', {'class': 'controls'});
    this.el.addEventListener('click', this.handleClick.bind(this));

    this.toggler = dom.el('span', {'class': 'btn toggler'});
    this.toggler.appendChild(dom.el('span', {'class': 'glyphicon glyphicon-cog'}));
    this.el.appendChild(this.toggler);

    this.play = dom.el('span', {'class': 'btn play'});
    this.play.appendChild(dom.el('span', {'class': 'glyphicon glyphicon-play'}));
    this.el.appendChild(this.play);

    document.body.appendChild(this.el);
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
    this.toggler.firstChild.classList.toggle('glyphicon-cog');
    this.toggler.firstChild.classList.toggle('glyphicon-remove');
  }

  handlePlay () {
    this.game.playing();
    this.play.firstChild.classList.toggle('glyphicon-play');
    this.play.firstChild.classList.toggle('glyphicon-pause');
  }
}
