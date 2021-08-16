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
import NordstromRack from '../src/lib/vendors/nordstromRack';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/NORDSTROMRACK.json';

describe('NORDSTROMRACK', () => {
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
      const orderData = await NordstromRack.parse(VENDOR_CODES.NORDSTROMRACK, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '214594736',
        orderDate: 1618617600000,
        products: [
          {
            name: 'Steve Madden – Softey Faux Fur Slide',
            price: 14.4,
            thumbnail: 'http://cdn.nordstromrack.com/products/SOFTEY/thumbnail/19307178.jpg'
          },
          {
            name: 'Sugar – Duck Boot',
            price: 17.98,
            thumbnail: 'http://cdn.nordstromrack.com/products/SGR-SKYLAR/thumbnail/18182105.jpg'
          }
        ],
        vendor: VENDOR_CODES.NORDSTROMRACK,
        emailId: '178e1717044ac67b'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty 1', 'Qty 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await NordstromRack.parse(VENDOR_CODES.NORDSTROMRACK, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '214594736',
        orderDate: 1618617600000,
        products: [
          {
            name: 'Steve Madden – Softey Faux Fur Slide (1)',
            price: 14.4,
            thumbnail: 'http://cdn.nordstromrack.com/products/SOFTEY/thumbnail/19307178.jpg'
          },
          {
            name: 'Steve Madden – Softey Faux Fur Slide (2)',
            price: 14.4,
            thumbnail: 'http://cdn.nordstromrack.com/products/SOFTEY/thumbnail/19307178.jpg'
          },
          {
            name: 'Sugar – Duck Boot',
            price: 17.98,
            thumbnail: 'http://cdn.nordstromrack.com/products/SGR-SKYLAR/thumbnail/18182105.jpg'
          }
        ],
        vendor: VENDOR_CODES.NORDSTROMRACK,
        emailId: '178e1717044ac67b'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(NordstromRack.parse(VENDOR_CODES.NORDSTROMRACK, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
