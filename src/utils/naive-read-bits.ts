/** @internal */

import {ReadBits} from './types';

/*
 * readBits(data, fromBit, nBits) => number
 *
 * This function reads n bits from an array of byte values.
 *
 * This is a simple implementation that's easy to test for correctness.
 * It is only used for testing the optimized implementation.
 */
export const readBits: ReadBits = (data, fromBit, nBits, result = 0) => {
  while (nBits-- > 0) {
    const curBit = fromBit + nBits;

    result = (result << 1) +
      +!!(data[curBit >> 3] & (1 << (curBit % 8)));
  }

  return result;
};
