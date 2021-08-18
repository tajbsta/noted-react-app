import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import FootLocker from '../src/lib/vendors/footLocker';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/FOOTLOCKER.json';

describe('FootLocker', () => {
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
      const orderData = await FootLocker.parse(VENDOR_CODES.FOOTLOCKER, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'V4011816446',
        orderDate: 0,
        products: [
          {
            name: "Nike NSW Collection Bra - Women's",
            thumbnail: '',
            price: 50
          }
        ],
        vendor: VENDOR_CODES.FOOTLOCKER,
        emailId: '179b8f2f3c2fd1a3'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`</strong>: 1`, `</strong>: 3`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await FootLocker.parse(VENDOR_CODES.FOOTLOCKER, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'V4011816446',
        orderDate: 0,
        products: [
          {
            name: "Nike NSW Collection Bra - Women's (1)",
            thumbnail: '',
            price: 50
          },
          {
            name: "Nike NSW Collection Bra - Women's (2)",
            thumbnail: '',
            price: 50
          },
          {
            name: "Nike NSW Collection Bra - Women's (3)",
            thumbnail: '',
            price: 50
          }
        ],
        vendor: VENDOR_CODES.FOOTLOCKER,
        emailId: '179b8f2f3c2fd1a3'
      });
    });

    it('should return a single product', async () => {
      const orderData = await FootLocker.parse(VENDOR_CODES.FOOTLOCKER, payload);
      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(FootLocker.parse(VENDOR_CODES.FOOTLOCKER, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
