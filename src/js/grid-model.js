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
   * Get a single cell value from the model's data.
   *
   * @param  {Number} row
   * @param  {Number} col
   * @return {Number|null}
   *         The value at the column and row given (or null).
   */
  getCell (row, col) {
    let r = store.get(this)[row];
    return Array.isArray(r) && _.isNumber(r[col]) ? r[col] : null;
  }

  /**
   * Set a single cell value in the model's data. The value is only set if
   * the cell exists.
   *
   * @param  {Number} row
   * @param  {Number} col
   * @param  {Number|Boolean} value
   *         Treated as truthy/falsy, set as one/zero respectively.
   * @return {Number|null}
   */
  setCell (row, col, value) {
    let current = this.getCell(col, row);
    if (current === null) {
      return current;
    }
    let updated = value ? 1 : 0;
    store.get(this)[row][col] = updated;
    return updated;
  }

  /**
   * Flip the value of a single cell between zero or one. The value is only
   * set if the cell exists.
   *
   * @param {Number} row
   * @param {Number} col
   * @return {Number|null}
   */
  flipCell (row, col) {
    let value = this.getCell(col, row);
    if (value === null) {
      return value;
    }
    return this.setCell(col, row, !value);
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
