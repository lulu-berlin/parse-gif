/*
 * readBits(data, fromBit, nBits) => number
 *
 * This function reads n bits from an array of byte values.
 *
 * This is a simple implementation that's easy to test for correctness.
 * It is only used for testing the optimized implementation.
 */
export const readBits = (data: ArrayLike<number>, fromBit: number, nBits: number) => {
  let result = 0;

  while (nBits-- > 0) {
    const curBit = fromBit + nBits;
    const offset = (curBit / 8) | 0;
    const bitmask = 1 << (curBit % 8);
    const bit = +!!(data[offset] & bitmask);

    result = (result << 1) + bit;
  }

  return result;
};
