import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as moment from 'moment-timezone';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import Nordstrom from '../src/lib/vendors/nordstrom';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/NORDSTROM.json';

describe('Nordstrom', () => {
  let sandbox: sinon.SinonSandbox;
  let payload: IEmailPayload = {
    raw: '',
    internalDate: '',
    decodedBody: ''
  };

  before(async () => {
    const res = await axios.get(TEST_DATA_URL);

    payload.decodedBody = Buffer.from(res.data.raw, 'base64').toString('utf-8');
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(helpers, 'parseHtmlString').callsFake((body: string) => {
      const dom = new jsdom.JSDOM(body);
      return dom.window.document;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('parse', () => {
    it('should return order data', async () => {
      const orderData = await Nordstrom.parse(VENDOR_CODES.NORDSTROM, payload);
      expect(orderData).to.be.deep.equal({
        order_ref: '688133745',
        order_date: 1617753600000,
        products: [
          {
            name: 'Jeffrey Campbell Hustler Platform Sandal (Women) - BLACK PATENT',
            price: 134.95,
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/4f3aacb8-9edc-4f5e-86c3-66dc7d08a93d.jpeg'
          },
          {
            name: 'Jeffrey Campbell Hustler Platform Sandal (Women) - DUSTY NUDE PATENT',
            price: 134.95,
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/f7d76b95-b9f6-4796-a4d5-dcb6b1a39bae.jpeg'
          }
        ],
        vendor: VENDOR_CODES.NORDSTROM
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      const regexToSearchFor = new RegExp('Qty: 1', 'g');
      updatedBody = updatedBody.replace(regexToSearchFor, 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Nordstrom.parse(VENDOR_CODES.NORDSTROM, updatedPayload);
      expect(orderData).to.be.deep.equal({
        order_ref: '688133745',
        order_date: 1617753600000,
        products: [
          {
            name: 'Jeffrey Campbell Hustler Platform Sandal (Women) - BLACK PATENT (1)',
            price: 134.95,
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/4f3aacb8-9edc-4f5e-86c3-66dc7d08a93d.jpeg'
          },
          {
            name: 'Jeffrey Campbell Hustler Platform Sandal (Women) - BLACK PATENT (2)',
            price: 134.95,
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/4f3aacb8-9edc-4f5e-86c3-66dc7d08a93d.jpeg'
          },
          {
            name: 'Jeffrey Campbell Hustler Platform Sandal (Women) - DUSTY NUDE PATENT (1)',
            price: 134.95,
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/f7d76b95-b9f6-4796-a4d5-dcb6b1a39bae.jpeg'
          },
          {
            name: 'Jeffrey Campbell Hustler Platform Sandal (Women) - DUSTY NUDE PATENT (2)',
            price: 134.95,
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/f7d76b95-b9f6-4796-a4d5-dcb6b1a39bae.jpeg'
          }
        ],
        vendor: VENDOR_CODES.NORDSTROM
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Nordstrom.parse(VENDOR_CODES.NORDSTROM, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
