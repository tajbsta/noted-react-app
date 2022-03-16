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
import Gucci from '../src/lib/vendors/gucci';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/GUCCI.json';

describe(`Gucci`, () => {
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
    payload.internalDate = res.data.internalDate;
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
      const orderData = await Gucci.parse(VENDOR_CODES.GUCCI, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'US47409139',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Baby polo shirt with Interlocking G',
            price: 185,
            thumbnail:
              'https://media.gucci.com/style/Transparent_Center_0_0_600x600/1617122703/548034_XJDKV_4392_001_100_0000_Light-Baby-polo-shirt-with-Interlocking-G.png'
          },
          {
            name: 'GG Marmont keychain wallet',
            price: 350,
            thumbnail:
              'https://media.gucci.com/style/Transparent_Center_0_0_600x600/1585747804/627064_DTDHT_1000_001_080_0023_Light-GG-Marmont-keychain-wallet.png'
          }
        ],
        vendor: VENDOR_CODES.GUCCI,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('    Qty:   1', '    Qty:   2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Gucci.parse(VENDOR_CODES.GUCCI, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'US47409139',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Baby polo shirt with Interlocking G (1)',
            price: 185,
            thumbnail:
              'https://media.gucci.com/style/Transparent_Center_0_0_600x600/1617122703/548034_XJDKV_4392_001_100_0000_Light-Baby-polo-shirt-with-Interlocking-G.png'
          },
          {
            name: 'Baby polo shirt with Interlocking G (2)',
            price: 185,
            thumbnail:
              'https://media.gucci.com/style/Transparent_Center_0_0_600x600/1617122703/548034_XJDKV_4392_001_100_0000_Light-Baby-polo-shirt-with-Interlocking-G.png'
          },
          {
            name: 'GG Marmont keychain wallet',
            price: 350,
            thumbnail:
              'https://media.gucci.com/style/Transparent_Center_0_0_600x600/1585747804/627064_DTDHT_1000_001_080_0023_Light-GG-Marmont-keychain-wallet.png'
          }
        ],
        vendor: VENDOR_CODES.GUCCI,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Gucci.parse(VENDOR_CODES.GUCCI, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
