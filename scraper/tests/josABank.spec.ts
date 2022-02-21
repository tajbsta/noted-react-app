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
import JosABank from '../src/lib/vendors/josABank';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/JOSABANK.json';

describe(`Jos. A. Bank`, () => {
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
      const orderData = await JosABank.parse(VENDOR_CODES.JOSABANK, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '122066888',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Jos. A. Bank Super Soft Socks, 1 Pair',
            price: 0,
            thumbnail: ''
          },
          {
            name: 'Jos. A. Bank White Collar Stays',
            price: 0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.JOSABANK,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<div style="font-family: arial, sans-serif; font-size: 12px;">\r\n\t\t1`,
        `<div style="font-family: arial, sans-serif; font-size: 12px;">\r\n\t\t2`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JosABank.parse(VENDOR_CODES.JOSABANK, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '122066888',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Jos. A. Bank Super Soft Socks, 1 Pair',
            price: 0,
            thumbnail: ''
          },
          {
            name: 'Jos. A. Bank White Collar Stays',
            price: 0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.JOSABANK,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JosABank.parse(VENDOR_CODES.JOSABANK, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
