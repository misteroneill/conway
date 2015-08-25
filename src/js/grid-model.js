import _ from 'lodash';

// Private data store for raw grid data.
const store = new WeakMap();

export default class GridModel {

  constructor (data) {
    store.set(this, Array.isArray(data) ? _.cloneDeep(data) : [[0]]);
  }

  data () {
    return _.cloneDeep(store.get(this));
  }

  destroy () {
    store.delete(this);
  }

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
