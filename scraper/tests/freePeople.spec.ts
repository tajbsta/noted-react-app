import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import FreePeople from '../src/lib/vendors/freePeople';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/FREEPEOPLE.json';

describe('Free People', () => {
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
      const orderData = await FreePeople.parse(VENDOR_CODES.FREEPEOPLE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'FP03812907',
        orderDate: 0,
        products: [
          {
            name: 'James Chelsea Boots',
            thumbnail: 'https://images.freepeople.com/is/image/FreePeople/56318025_010_e',
            price: 178
          }
        ],
        vendor: VENDOR_CODES.FREEPEOPLE,
        emailId: '17477fede5cd523e'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;
      updatedBody = updatedBody.replace(`<td class="item-price-large">1</td>`, `<td class="item-price-large">3</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await FreePeople.parse(VENDOR_CODES.FREEPEOPLE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'FP03812907',
        orderDate: 0,
        products: [
          {
            name: 'James Chelsea Boots (1)',
            thumbnail: 'https://images.freepeople.com/is/image/FreePeople/56318025_010_e',
            price: 178
          },
          {
            name: 'James Chelsea Boots (2)',
            thumbnail: 'https://images.freepeople.com/is/image/FreePeople/56318025_010_e',
            price: 178
          },
          {
            name: 'James Chelsea Boots (3)',
            thumbnail: 'https://images.freepeople.com/is/image/FreePeople/56318025_010_e',
            price: 178
          }
        ],
        vendor: VENDOR_CODES.FREEPEOPLE,
        emailId: '17477fede5cd523e'
      });
    });

    it('should return a single product', async () => {
      const orderData = await FreePeople.parse(VENDOR_CODES.FREEPEOPLE, payload);

      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(FreePeople.parse(VENDOR_CODES.FREEPEOPLE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
