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
import JOURNEYS from '../src/lib/vendors/journeys';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/JOURNEYS.json';

describe('JOURNEYS', () => {
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
      const orderData = await JOURNEYS.parse(VENDOR_CODES.JOURNEYS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '508518348',
        orderDate: 1603843200000,
        products: [
          {
            name: 'Dr. Martens 2976 Platform Chelsea Boot - White',
            thumbnail: '',
            price: 179.99
          }
        ],
        vendor: VENDOR_CODES.JOURNEYS,
        emailId: '1756f3605bde76fe'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`QTY: 1`, `QTY: 3`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JOURNEYS.parse(VENDOR_CODES.JOURNEYS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '508518348',
        orderDate: 1603843200000,
        products: [
          {
            name: 'Dr. Martens 2976 Platform Chelsea Boot - White (1)',
            thumbnail: '',
            price: 179.99
          },
          {
            name: 'Dr. Martens 2976 Platform Chelsea Boot - White (2)',
            thumbnail: '',
            price: 179.99
          },
          {
            name: 'Dr. Martens 2976 Platform Chelsea Boot - White (3)',
            thumbnail: '',
            price: 179.99
          }
        ],
        vendor: VENDOR_CODES.JOURNEYS,
        emailId: '1756f3605bde76fe'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JOURNEYS.parse(VENDOR_CODES.JOURNEYS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
