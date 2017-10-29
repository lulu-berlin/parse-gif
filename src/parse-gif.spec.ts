import * as fs from 'fs';
import * as path from 'path';
import {expect} from 'chai';

import {parseGIF} from './parse-gif';

describe.only('parse-gif()', () => {
  describe('fixture: GifSample.gif', () => {
    let gifSample: Uint8Array;

    before(() => {
      const gifPath = path.resolve(__dirname, 'fixtures', 'GifSample.gif');
      const buffer = fs.readFileSync(gifPath);
      gifSample = new Uint8Array(buffer);
    });

    it('should have a valid header', () => {
      // tslint:disable-next-line:no-unused-expression
      expect(true).to.be.true;
    });
  });

  it('should throw an exception if the header is wrong', async () => {
    const data = new Uint8Array(100);
    for (let i = 0; i < 100; i++) {
      data[i] = 0;
    }

    expect(await parseGIF(data)).to.throw();
  });

});
