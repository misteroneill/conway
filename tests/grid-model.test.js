import _ from 'lodash';
import assert from 'assert';
import GridModel from '../src/js/grid-model';

const data = [
  [0, 1, 0, 1],
  [1, 0, 0, 1],
  [0, 0, 0, 1],
  [0, 1, 1, 0]
];

let model;

describe('GridModel', () => {

  beforeEach(() => {
    model = new GridModel(data);
  });

  describe('#populate()', () => {

    it('should throw an error if given a bad value', () => {
      assert.throws(() => {
        model.populate(null);
      });

      assert.throws(() => {
        model.populate({});
      });

      assert.throws(() => {
        model.populate([]);
      });

      assert.throws(() => {
        model.populate([[]]);
      });
    });

    it('should accept an array with at least one array element with at least one number element', () => {
      assert.doesNotThrow(() => {
        model.populate([[1]]);
      });
    });
  });

  describe('#data()', () => {

    it('should be an array', () => {
      assert(Array.isArray(model.data()));
    });

    it('should never expose internal data array as mutable', () => {
      assert.notStrictEqual(model.data(), data);
      assert.notStrictEqual(model.data(), model.data());
    });
  });

  describe('#resize()', () => {

    it('should add new rows and cells', () => {
      model.resize(5, 5);
      let data = model.data();
      assert.equal(data.length, 5);
      assert.equal(data[0].join('-'), '0-1-0-1-0');
      assert.equal(data[1].join('-'), '1-0-0-1-0');
      assert.equal(data[2].join('-'), '0-0-0-1-0');
      assert.equal(data[3].join('-'), '0-1-1-0-0');
      assert.equal(data[4].join('-'), '0-0-0-0-0');
    });

    it('should remove rows and cells', () => {
      model.resize(3, 3);
      let data = model.data();
      assert.equal(data.length, 3);
      assert.equal(data[0].join('-'), '0-1-0');
      assert.equal(data[1].join('-'), '1-0-0');
      assert.equal(data[2].join('-'), '0-0-0');
    });
  });
});
