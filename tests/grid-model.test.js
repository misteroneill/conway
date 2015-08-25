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
      assert.strictEqual(data.length, 5);
      assert.strictEqual(data[0].join('-'), '0-1-0-1-0');
      assert.strictEqual(data[1].join('-'), '1-0-0-1-0');
      assert.strictEqual(data[2].join('-'), '0-0-0-1-0');
      assert.strictEqual(data[3].join('-'), '0-1-1-0-0');
      assert.strictEqual(data[4].join('-'), '0-0-0-0-0');
    });

    it('should remove rows and cells', () => {
      model.resize(3, 3);
      let data = model.data();
      assert.strictEqual(data.length, 3);
      assert.strictEqual(data[0].join('-'), '0-1-0');
      assert.strictEqual(data[1].join('-'), '1-0-0');
      assert.strictEqual(data[2].join('-'), '0-0-0');
    });
  });

  describe('#getCell()', () => {

    it('should return expected values', () => {
      assert.strictEqual(model.getCell(0, 1), 1);
      assert.strictEqual(model.getCell(3, 3), 0);
      assert.strictEqual(model.getCell(5, 5), null);
    });
  });

  describe('#setCell()', () => {

    it('should update values', () => {
      assert.strictEqual(model.setCell(0, 1, false), 0);
      assert.strictEqual(model.setCell(3, 3, 1), 1);
      assert.strictEqual(model.setCell(5, 5, 0), null);
    });
  });

  describe('#flipCell()', () => {

    it('should flip values', () => {
      assert.strictEqual(model.flipCell(0, 1), 0);
      assert.strictEqual(model.flipCell(3, 3), 1);
      assert.strictEqual(model.flipCell(5, 5), null);
    });
  });
});
