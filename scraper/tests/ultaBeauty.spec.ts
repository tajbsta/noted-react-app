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
import UltaBeauty from '../src/lib/vendors/ultaBeauty';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ULTABEAUTY.json';

describe.only('Ulta Beauty', () => {
  let sandbox: sinon.SinonSandbox;
  let payload: IEmailPayload = {
    raw: '',
    id: '',
    internalDate: '',
    decodedBody: ''
  };

  before(async () => {
    const res = await axios.get(TEST_DATA_URL);

    payload.decodedBody = Buffer.from(res.data.raw, 'base64').toString('utf-8');
    payload.id = res.data.id;
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
      const orderData = await UltaBeauty.parse(VENDOR_CODES.ULTABEAUTY, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'K192263205',
        orderDate: 1634860800000,
        products: [
          {
            name: 'KENRA PROFESSIONAL Platinum Silkening Gloss',
            price: 22.99,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2097599?$md$'
          },
          {
            name: 'WLDKAT Glow-To-Go Refillable Travel Kit',
            price: 39.0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587963?$md$'
          },
          {
            name: 'WLDKAT Free Starflower + Snow Mushroom Ultra-Hydrating Sleep Mask deluxe sample with $25 brand purchase',
            price: 0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587954?$md$'
          },
          {
            name: 'WLDKAT Free Mushroom + Moss Hydrating Gel Cream deluxe sample with $25 brand purchase',
            price: 0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587910?$md$'
          }
        ],
        vendor: VENDOR_CODES.ULTABEAUTY,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1<br /><br />', '2<br /><br />');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await UltaBeauty.parse(VENDOR_CODES.ULTABEAUTY, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'K192263205',
        orderDate: 1634860800000,
        products: [
          {
            name: 'KENRA PROFESSIONAL Platinum Silkening Gloss',
            price: 22.99,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2097599?$md$'
          },
          {
            name: 'WLDKAT Glow-To-Go Refillable Travel Kit',
            price: 39.0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587963?$md$'
          },
          {
            name: 'WLDKAT Free Starflower + Snow Mushroom Ultra-Hydrating Sleep Mask deluxe sample with $25 brand purchase (1)',
            price: 0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587954?$md$'
          },
          {
            name: 'WLDKAT Free Starflower + Snow Mushroom Ultra-Hydrating Sleep Mask deluxe sample with $25 brand purchase (2)',
            price: 0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587954?$md$'
          },
          {
            name: 'WLDKAT Free Mushroom + Moss Hydrating Gel Cream deluxe sample with $25 brand purchase',
            price: 0,
            thumbnail: 'https://images.ulta.com/is/image/Ulta/2587910?$md$'
          }
        ],
        vendor: VENDOR_CODES.ULTABEAUTY,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(UltaBeauty.parse(VENDOR_CODES.ULTABEAUTY, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
