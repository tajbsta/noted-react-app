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
import Claires from '../src/lib/vendors/claires';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/CLAIRES.json';

describe('Claires', () => {
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
      const orderData = await Claires.parse(VENDOR_CODES.CLAIRES, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '011158786',
        orderDate: 1634860800000,
        products: [
          {
            name: '7th Heaven Superfood Avocado Clay Mask',
            price: 1.0,
            thumbnail:
              'https://www.claires.com/dw/image/v2/BBTK_PRD/on/demandware.static/-/Sites-master-catalog/default/dw872e3b32/images/hi-res/68735_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.CLAIRES,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`QTY: 1`, `QTY: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Claires.parse(VENDOR_CODES.CLAIRES, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '011158786',
        orderDate: 1634860800000,
        products: [
          {
            name: '7th Heaven Superfood Avocado Clay Mask (1)',
            price: 1.0,
            thumbnail:
              'https://www.claires.com/dw/image/v2/BBTK_PRD/on/demandware.static/-/Sites-master-catalog/default/dw872e3b32/images/hi-res/68735_1.jpg'
          },
          {
            name: '7th Heaven Superfood Avocado Clay Mask (2)',
            price: 1.0,
            thumbnail:
              'https://www.claires.com/dw/image/v2/BBTK_PRD/on/demandware.static/-/Sites-master-catalog/default/dw872e3b32/images/hi-res/68735_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.CLAIRES,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Claires.parse(VENDOR_CODES.CLAIRES, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
