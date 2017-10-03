import jsc = require('jsverify');
import {expect} from 'chai';

import {readBits} from './naive-read-bits';

describe('Naïve implementation of readBits():', () => {
  describe('Properties:', () => {
    jsc.property(
      'readBits([0xff, 0xff, ...], x, y) === (1 << y) - 1',
      jsc.uint8, jsc.nat(14),
      (x, y) => readBits(
        Array.from({length: x / 8 + y / 8 + 1}, () => 0xff),
        x,
        y
      ) === (1 << y) - 1
    );

    jsc.property(
      'readBits([0x00, 0x00, ...], x, y) === 0',
      jsc.uint8, jsc.nat(14),
      (x, y) => readBits(
        Array.from({length: x / 8 + y / 8 + 1}, () => 0x00),
        x,
        y
      ) === 0
    );
  });

  describe('Unit tests:', () => {
    it('should read zero byte at offset 0', () => {
      const data = [0];
      const result = readBits(data, 0, 8);

      expect(result).to.equal(0);
    });

    it('should read full byte at offset 0', () => {
      const data = [0b11111111];
      const result = readBits(data, 0, 8);

      expect(result).to.equal(0b11111111);
    });

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

    it('should read 12 bits', () => {
      const data = [0b11111111, 0b00001111];
      const result = readBits(data, 0, 12);

      expect(result).to.equal(0b111111111111);
    });

    it('should read 12 bits skipping one bit', () => {
      const data = [0b11111110, 0b00011111];
      const result = readBits(data, 1, 12);

      expect(result).to.equal(0b111111111111);
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

    it('should mask out irrelevant bits', () => {
      const data = [0b11111111];
      const result = readBits(data, 3, 4);

      expect(result).to.equal(0b1111);
    });

    it('should mask out irrelevant bits across bytes', () => {
      const data = [0b11111111, 0b11111111];
      const result = readBits(data, 6, 6);

      expect(result).to.equal(0b111111);
    });

    it('readBits([0, 1], 8, 0) should equal 0', () => {
      expect(readBits([0, 1], 8, 0)).to.equal(0);
    });
  });
});
