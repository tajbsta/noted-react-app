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
import LuckyBrand from '../src/lib/vendors/luckyBrand';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LUCKYBRAND.json';

describe('Lucky Brand', () => {
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
      const orderData = await LuckyBrand.parse(VENDOR_CODES.LUCKYBRAND, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '15844897',
        orderDate: 0,
        products: [
          {
            name: 'SHORT SLEEVE OPEN NECK SHIRT',
            price: 41.7,
            thumbnail: 'http://i1.adis.ws/i/lucky/7W45988_101_1/S/S-OPEN-NECK-SHIRT-101?$medium$'
          },
          {
            name: 'HR LUCKY PINS SHORT',
            price: 29.75,
            thumbnail: 'http://i1.adis.ws/i/lucky/7WD11488_110_1/HR-LUCKY-PINS-SHORT-110?$medium$'
          },
          {
            name: 'KNOTTED CAMI',
            price: 17.7,
            thumbnail: 'http://i1.adis.ws/i/lucky/7W65841A_432_1/KNOTTED-CAMI-432?$medium$'
          }
        ],
        vendor: VENDOR_CODES.LUCKYBRAND,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `line-height: 21px; padding-bottom: 10px;">Quantity: 1`,
        `line-height: 21px; padding-bottom: 10px;">Quantity: 2`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await LuckyBrand.parse(VENDOR_CODES.LUCKYBRAND, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '15844897',
        orderDate: 0,
        products: [
          {
            name: 'SHORT SLEEVE OPEN NECK SHIRT (1)',
            price: 41.7,
            thumbnail: 'http://i1.adis.ws/i/lucky/7W45988_101_1/S/S-OPEN-NECK-SHIRT-101?$medium$'
          },
          {
            name: 'SHORT SLEEVE OPEN NECK SHIRT (2)',
            price: 41.7,
            thumbnail: 'http://i1.adis.ws/i/lucky/7W45988_101_1/S/S-OPEN-NECK-SHIRT-101?$medium$'
          },
          {
            name: 'HR LUCKY PINS SHORT',
            price: 29.75,
            thumbnail: 'http://i1.adis.ws/i/lucky/7WD11488_110_1/HR-LUCKY-PINS-SHORT-110?$medium$'
          },
          {
            name: 'KNOTTED CAMI',
            price: 17.7,
            thumbnail: 'http://i1.adis.ws/i/lucky/7W65841A_432_1/KNOTTED-CAMI-432?$medium$'
          }
        ],
        vendor: VENDOR_CODES.LUCKYBRAND,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(LuckyBrand.parse(VENDOR_CODES.LUCKYBRAND, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
