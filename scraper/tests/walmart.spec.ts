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
import Walmart from '../src/lib/vendors/walmart';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/WALMART.json';

describe('WALMART', () => {
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
      const orderData = await Walmart.parse(VENDOR_CODES.WALMART, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '5482081-620168',
        orderDate: 1601596800000,
        products: [
          {
            name: '12 Pack Shoe Storage Boxes, BTMWAY Clear Plastic Stackable Shoe Storage Cabinet, Under Bed Shoe Organizer Box Cube, Foldable Modular Shoe Organizing Rack Bins Case Shoes Boxes Storage Containers, R501',
            thumbnail: '',
            price: 41.99
          },
          {
            name: 'Mainstays Classic 4 Drawer Dresser, White Finish',
            thumbnail: '',
            price: 110
          }
        ],
        vendor: VENDOR_CODES.WALMART,
        emailId: '174f3470306c5fd6'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Qty: 1`, `Qty: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Walmart.parse(VENDOR_CODES.WALMART, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '5482081-620168',
        orderDate: 1601596800000,
        products: [
          {
            name: '12 Pack Shoe Storage Boxes, BTMWAY Clear Plastic Stackable Shoe Storage Cabinet, Under Bed Shoe Organizer Box Cube, Foldable Modular Shoe Organizing Rack Bins Case Shoes Boxes Storage Containers, R501 (1)',
            thumbnail: '',
            price: 41.99
          },
          {
            name: '12 Pack Shoe Storage Boxes, BTMWAY Clear Plastic Stackable Shoe Storage Cabinet, Under Bed Shoe Organizer Box Cube, Foldable Modular Shoe Organizing Rack Bins Case Shoes Boxes Storage Containers, R501 (2)',
            thumbnail: '',
            price: 41.99
          },
          {
            name: 'Mainstays Classic 4 Drawer Dresser, White Finish',
            thumbnail: '',
            price: 110
          }
        ],
        vendor: VENDOR_CODES.WALMART,
        emailId: '174f3470306c5fd6'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Walmart.parse(VENDOR_CODES.WALMART, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
