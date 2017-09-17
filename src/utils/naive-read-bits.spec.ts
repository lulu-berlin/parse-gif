import jsc = require('jsverify');
import {expect} from 'chai';

import {readBits} from './naive-read-bits';

describe('Naïve implementation of readBits()', () => {
  describe('properties', () => {
    jsc.property(
      'readBits([(fromBit / 8 + 1) * 0xff], fromBit, 1) === 1',
      jsc.uint8,
      fromBit => readBits(
        Array.from({length: fromBit / 8 + 1}, () => 0xff),
        fromBit,
        1
      ) === 1
    );

    jsc.property(
      'readBits([(fromBit / 8 + 1) * 0x00], fromBit, 1) === 0',
      jsc.uint8,
      fromBit => readBits(
        Array.from({length: fromBit / 8 + 1}, () => 0x00),
        fromBit,
        1
      ) === 0
    );

    jsc.property(
      'readBits([x], 0, 8) === x',
      jsc.uint8,
      x => readBits([x], 0, 8) === x
    );

    jsc.property(
      'readBits([0, 0, ...], x, y) === 0',
      jsc.uint8, jsc.uint8,
      (x, y) => readBits(
        Array.from({length: x / 8 + y / 8 + 1}, () => 0x00),
        x,
        y
      ) === 0
    );

    jsc.property(
      'readBits([0xff, 0xff, ...], x, y) === (1 << y) - 1',
      jsc.uint8, jsc.nat(14),
      (x, y) => readBits(
        Array.from({length: x / 8 + y / 8 + 1}, () => 0xff),
        x,
        y
      ) === (1 << y) - 1
    );
  });

  describe('unit tests', () => {
    it('should read lower 5 true bits', () => {
      const data = [0b00011111];
      const result = readBits(data, 0, 5);

      expect(result).to.equal(0b11111);
    });

    it('should read lower 5 false bits', () => {
      const data = [0b00000000];
      const result = readBits(data, 0, 5);

      expect(result).to.equal(0b00000);
    });

    it('should read lower 5 alternating bits', () => {
      const data = [0b00010101];
      const result = readBits(data, 0, 5);

      expect(result).to.equal(0b10101);
    });

    it('should read higher 5 true bits', () => {
      const data = [0b11111000];
      const result = readBits(data, 3, 5);

      expect(result).to.equal(0b11111);
    });

    it('should read higher 5 false bits', () => {
      const data = [0b00000000];
      const result = readBits(data, 3, 5);

      expect(result).to.equal(0b00000);
    });

    it('should read higher 5 alternating bits', () => {
      const data = [0b10101000];
      const result = readBits(data, 3, 5);

      expect(result).to.equal(0b10101);
    });

    it('should read across bytes', () => {
      const data = [0b11110000, 0b00001111];
      const result = readBits(data, 4, 8);

      expect(result).to.equal(0b11111111);
    });

    it('should read far away byte', () => {
      const data = [0, 0, 0, 0, 0b11111111];
      const result = readBits(data, 8 * 4, 8);

      expect(result).to.equal(0b11111111);
    });

    it('should read far away bit', () => {
      const data = [0, 0, 0, 0, 0, 0b00001000];
      const result = readBits(data, 8 * 5 + 3, 1);

      expect(result).to.equal(0b1);
    });
  });
});
