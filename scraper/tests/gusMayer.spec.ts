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
import GusMayer from '../src/lib/vendors/gusMayer';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/GUSMAYER.json';

describe('Gus Mayer', () => {
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
      const orderData = await GusMayer.parse(VENDOR_CODES.GUSMAYER, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '3177',
        orderDate: 0,
        products: [
          {
            name: 'Kensington Rainshine Chelsea Boot in Tea',
            price: 70,
            thumbnail: 'https://cdn.shopify.com/s/files/1/0364/8851/1620/products/tea2_compact_cropped.jpg?v=1615775362'
          },
          {
            name: 'Kensington Rainshine Chelsea Boot in Mica',
            price: 70,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0364/8851/1620/products/3af2bb37-d39f-49ef-9d7d-2b5e04ab91ee_compact_cropped.jpg?v=1615775158'
          }
        ],
        vendor: VENDOR_CODES.GUSMAYER,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</span>`, `2</span>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await GusMayer.parse(VENDOR_CODES.GUSMAYER, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '3177',
        orderDate: 0,
        products: [
          {
            name: 'Kensington Rainshine Chelsea Boot in Tea (1)',
            price: 70,
            thumbnail: 'https://cdn.shopify.com/s/files/1/0364/8851/1620/products/tea2_compact_cropped.jpg?v=1615775362'
          },
          {
            name: 'Kensington Rainshine Chelsea Boot in Tea (2)',
            price: 70,
            thumbnail: 'https://cdn.shopify.com/s/files/1/0364/8851/1620/products/tea2_compact_cropped.jpg?v=1615775362'
          },
          {
            name: 'Kensington Rainshine Chelsea Boot in Mica',
            price: 70,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0364/8851/1620/products/3af2bb37-d39f-49ef-9d7d-2b5e04ab91ee_compact_cropped.jpg?v=1615775158'
          }
        ],
        vendor: VENDOR_CODES.GUSMAYER,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(GusMayer.parse(VENDOR_CODES.GUSMAYER, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
