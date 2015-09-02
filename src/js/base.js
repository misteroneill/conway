import events from 'events';

export default class Base extends events.EventEmitter {

  /**
   * Creates per-instance bound methods from a given array of method names.
   *
   * @param  {Array} methods
   */
  bindMethods (methods) {
    methods.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }
}
