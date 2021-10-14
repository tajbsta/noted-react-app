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
import MACCosmetics from '../src/lib/vendors/macCosmetics';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/MACCOSMETICS.json';

describe('M.A.C. Cosmetics', () => {
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
      const orderData = await MACCosmetics.parse(VENDOR_CODES.MACCOSMETICS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '4032121392',
        orderDate: 1622937600000,
        products: [
          {
            name: 'Prep + Prime Lip',
            price: 19,
            thumbnail: 'https://m.maccosmetics.com/media/export/cms/products/280x320/mac_sku_M4XA01_280x320_0.jpg'
          },
          {
            name: 'Matte Lipstick',
            price: 19,
            thumbnail: 'https://m.maccosmetics.com/media/export/cms/products/280x320/mac_sku_M2LP37_280x320_0.jpg'
          }
        ],
        vendor: VENDOR_CODES.MACCOSMETICS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`text-align: center;">1</td>`, `text-align: center;">2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await MACCosmetics.parse(VENDOR_CODES.MACCOSMETICS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '4032121392',
        orderDate: 1622937600000,
        products: [
          {
            name: 'Prep + Prime Lip (1)',
            price: 19,
            thumbnail: 'https://m.maccosmetics.com/media/export/cms/products/280x320/mac_sku_M4XA01_280x320_0.jpg'
          },
          {
            name: 'Prep + Prime Lip (2)',
            price: 19,
            thumbnail: 'https://m.maccosmetics.com/media/export/cms/products/280x320/mac_sku_M4XA01_280x320_0.jpg'
          },
          {
            name: 'Matte Lipstick',
            price: 19,
            thumbnail: 'https://m.maccosmetics.com/media/export/cms/products/280x320/mac_sku_M2LP37_280x320_0.jpg'
          }
        ],
        vendor: VENDOR_CODES.MACCOSMETICS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(MACCosmetics.parse(VENDOR_CODES.MACCOSMETICS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
