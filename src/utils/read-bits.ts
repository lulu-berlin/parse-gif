const BITMASK = Array.from({ length: 9 }, (_, i) => (1 << i) - 1);

/*
 * readBits(data, fromBit, nBits):
 *
 */
export const readBits = (data: ArrayLike<number>, from: number, nBits: number): number => {
  const offset = from >> 3;
  const fromBit = from % 8;
  let result = (
    data[offset] >> fromBit
  ) & (
    BITMASK[Math.min(nBits, 8)]
  );

  for (
    let i = 0, bitsToRead = nBits - Math.min(8 - fromBit, 8);
    bitsToRead > 0;
    bitsToRead -= 8
  ) {
    result += (
      (
        data[++i + offset] & BITMASK[Math.min(bitsToRead, 8)]
      ) << (
        (i << 3) - fromBit
      )
    );
  }

  return result;
};
