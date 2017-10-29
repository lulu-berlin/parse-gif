import {readBits} from './utils';

export type ParseGIF = (gif: Uint8Array) => Promise<void>;

export const parseGIF: ParseGIF = async (gif) => {
  readBits(gif, 0, 6);
  throw new Error('bla?');
};
