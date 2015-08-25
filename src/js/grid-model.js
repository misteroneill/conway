import _ from 'lodash';

// Private data store for raw grid data.
const store = new WeakMap();

/**
 * Represents a two-dimensional grid of binary cells (ones and zeros).
 *
 * By default, it is populated with a 1x1 grid containing a single zero.
 *
 * @class GridModel
 */
export default class GridModel {

  /**
   * GridModel constructor.
   *
   * @constructor
   * @param       {Array} data Provide initial data for the model.
   */
  constructor (data) {
    this.populate(Array.isArray(data) ? _.cloneDeep(data) : [[0]]);
  }

  /**
   * Get a deep clone of the model's data.
   *
   * @method data
   * @return {Array}
   */
  data () {
    let data = store.get(this);
    if (!data) {
      this.populate([[0]]);
    }
    return _.cloneDeep(store.get(this));
  }

  /**
   * Destroy this model's data.
   *
   * @method destroy
   */
  destroy () {
    store.delete(this);
  }

  /**
   * Populate the model with entirely new data.
   *
   * @method populate
   * @param  {Array} data
   */
  populate (data) {
    if (!Array.isArray(data)) {
      throw new Error('data must be an array');
    }
    if (!Array.isArray(data[0]) || !_.isNumber(data[0][0])) {
      throw new Error('data[0] must be an array with at least one number');
    }
    store.set(this, data);
  }

  /**
   * Resize the model data. Newly created rows/cells will be populated with
   * zeros.
   *
   * @method resize
   * @param  {Number} rowCountNew
   * @param  {Number} colCountNew
   */
  resize (rowCountNew, colCountNew) {
    let data = store.get(this);
    let rowCountOld = data.length;
    let rowDiff = rowCountNew - rowCountOld;
    let colCountOld = data[0].length;
    let colDiff = colCountNew - colCountOld;

    // Adding new row(s) of dead cells.
    if (rowDiff > 0) {
      for (let i = rowCountOld; i < rowCountNew; i++) {
        data[i] = _.fill(Array(colCountNew), 0);
      }

    // Removing old row(s).
    } else if (rowDiff < 0) {
      data.length += rowDiff;
    }

    // Adding or removing dead cells from existing row(s).
    if (colDiff !== 0) {

      // The `Math.min` call here ensures that we don't iterate too far if
      // the number of rows was reduced.
      for (let i = 0; i < Math.min(rowCountOld, data.length); i++) {
        if (colDiff > 0) {
          data[i] = data[i].concat(_.fill(Array(colDiff), 0));
        } else {
          data[i].length += colDiff;
        }
      }
    }
  }
}
