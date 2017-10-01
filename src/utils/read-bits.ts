import {ReadBits} from './types';

const BITMASK = Array.from({ length: 9 }, (_, i) => (1 << i) - 1);

const getBitmask = (n: number) => BITMASK[n < 8 ? n : 8];

/*
 * readBits(data, fromBit, nBits):
 *
 */
export const readBits: ReadBits = (
  data, from, nBits,
  // the following are hidden parameters used to improve minification
  offset = from >> 3,
  fromBit = from % 8,
  result = (data[offset] >> fromBit) & getBitmask(nBits),
  i = 0,
  bitsToRead = nBits - Math.min(8 - fromBit, 8)
) => {
  while (bitsToRead > 0) {
    result += (
      (data[++i + offset] & getBitmask(bitsToRead)) << ((i << 3) - fromBit)
    );
    bitsToRead -= 8;
  }

  return result;
};
