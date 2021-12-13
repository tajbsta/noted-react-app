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
import EverythingButWater from '../src/lib/vendors/everythingButWater';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/EVERYTHINGBUTWATER.json';

describe(`Everything But Water`, () => {
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
      const orderData = await EverythingButWater.parse(VENDOR_CODES.EVERYTHINGBUTWATER, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '10725366',
        orderDate: 1634860800000,
        products: [
          {
            name: 'HA91276O - Neon Knotted Hair Scrunchie',
            price: 4.99,
            thumbnail: ''
          },
          {
            name: '172-260 - Organic Hand Sanitizing Spray',
            price: 5.0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.EVERYTHINGBUTWATER,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('sans-serif;font-size:11px;">1</td>', 'sans-serif;font-size:11px;">2</td>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await EverythingButWater.parse(VENDOR_CODES.EVERYTHINGBUTWATER, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '10725366',
        orderDate: 1634860800000,
        products: [
          {
            name: 'HA91276O - Neon Knotted Hair Scrunchie (1)',
            price: 4.99,
            thumbnail: ''
          },
          {
            name: 'HA91276O - Neon Knotted Hair Scrunchie (2)',
            price: 4.99,
            thumbnail: ''
          },
          {
            name: '172-260 - Organic Hand Sanitizing Spray',
            price: 5.0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.EVERYTHINGBUTWATER,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(EverythingButWater.parse(VENDOR_CODES.EVERYTHINGBUTWATER, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
