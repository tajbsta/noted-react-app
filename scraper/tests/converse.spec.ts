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
import Converse from '../src/lib/vendors/converse';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/CONVERSE.json';

describe('Converse', () => {
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
      const orderData = await Converse.parse(VENDOR_CODES.CONVERSE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '995130078',
        orderDate: 1610582400000,
        products: [
          {
            name: 'Run Star Hike',
            thumbnail:
              'https://www.converse.com/on/demandware.static/-/Sites-cnv-master-catalog/default/dwfbad46aa/images/a_08/166799C_A_08X1.jpg',
            price: 110
          }
        ],
        vendor: VENDOR_CODES.CONVERSE,
        emailId: '17701e02df28bfa8'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`<strong>1`, `<strong>3`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Converse.parse(VENDOR_CODES.CONVERSE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '995130078',
        orderDate: 1610582400000,
        products: [
          {
            name: 'Run Star Hike (1)',
            thumbnail:
              'https://www.converse.com/on/demandware.static/-/Sites-cnv-master-catalog/default/dwfbad46aa/images/a_08/166799C_A_08X1.jpg',
            price: 110
          },
          {
            name: 'Run Star Hike (2)',
            thumbnail:
              'https://www.converse.com/on/demandware.static/-/Sites-cnv-master-catalog/default/dwfbad46aa/images/a_08/166799C_A_08X1.jpg',
            price: 110
          },
          {
            name: 'Run Star Hike (3)',
            thumbnail:
              'https://www.converse.com/on/demandware.static/-/Sites-cnv-master-catalog/default/dwfbad46aa/images/a_08/166799C_A_08X1.jpg',
            price: 110
          }
        ],
        vendor: VENDOR_CODES.CONVERSE,
        emailId: '17701e02df28bfa8'
      });
    });

    it('should return a single product', async () => {
      const orderData = await Converse.parse(VENDOR_CODES.CONVERSE, payload);

      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Converse.parse(VENDOR_CODES.CONVERSE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
