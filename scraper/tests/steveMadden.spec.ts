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
import SteveMadden from '../src/lib/vendors/steveMadden';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/STEVEMADDEN.json';

describe('STEVEMADDEN', () => {
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
      const orderData = await SteveMadden.parse(VENDOR_CODES.STEVEMADDEN, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '3112172',
        orderDate: 1619049600000,
        products: [
          {
            name: 'JTHRILED',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2170/8465/products/STEVEMADDEN-KIDS_JTHRILLED_BUTTERFLY_SIDE.jpg?v=1617801985',
            price: 40
          },
          {
            name: 'JBROOKS',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2170/8465/products/STEVEMADDEN-KIDS_JBROOKS_TIE-DYE-RHINESTONE_SIDE.jpg?v=1616455261',
            price: 35
          }
        ],
        vendor: VENDOR_CODES.STEVEMADDEN,
        emailId: '178f9d1f398fca16'
      });
    });

    /**STEVE MADDEN RECEIPT DOES NOT CONTAIN QUANTITY**/

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(SteveMadden.parse(VENDOR_CODES.STEVEMADDEN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
