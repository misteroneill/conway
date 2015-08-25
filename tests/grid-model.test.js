import assert from 'assert';
import GridModel from '../src/js/grid-model';

const data = [
  [0, 1, 0],
  [1, 0, 0],
  [0, 0, 0],
];

const model = new GridModel(data);

describe('GridModel', () => {

  describe('#data()', () => {

    it('should be an array', () => {
      assert(Array.isArray(model.data()));
    });

    it('should never expose internal data array as mutable', () => {
      assert.notStrictEqual(model.data(), data);
      assert.notStrictEqual(model.data(), model.data());
    });
  });
});
