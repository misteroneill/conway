import _ from 'lodash';
import assert from 'assert';
import Model from '../src/js/model';

const data = [
  [0, 1, 0, 1],
  [1, 0, 0, 1],
  [0, 0, 0, 1],
  [0, 1, 1, 0]
];

let model;

describe('Model', () => {

  beforeEach(() => {
    model = new Model(data);
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

  describe('#genocide', () => {

    it('should kill all living cells', () => {
      model.genocide();
      assert(_.flatten(model.data()).every(cell => !cell));
    });
  });

  describe('#randomize', () => {

    it('should randomly populate the model', () => {
      model.randomize();
      let cells = _.flatten(model.data());
      assert.notStrictEqual(cells.join('-'), _.flatten(data).join('-'));
      assert(cells.some(cell => !!cell));
      assert(cells.some(cell => !cell));
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

  describe('#tick()', () => {

    it('rule #1: should kill live cells with fewer than two living neighbors', () => {
      model.populate([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]);
      model.tick();
      assert.strictEqual(model.data()[1][1], 0);
    });

    it('rule #2: should leave alive any living cells with two or three neighbors', () => {
      model.populate([
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ]);
      model.tick();
      assert.strictEqual(model.data()[1][1], 1);
    });

    it('rule #3: should kill live cells with more than three living neighbors', () => {
      model.populate([
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ]);
      model.tick();
      assert.strictEqual(model.data()[1][1], 0);
    });

    it('rule #4: should bring to life dead cells with exactly three living neighbors', () => {
      model.populate([
        [0, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ]);
      model.tick();
      assert.strictEqual(model.data()[1][1], 1);
    });
  });
});
