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
import AnnTaylor from '../src/lib/vendors/annTaylor';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ANNTAYLOR.json';

describe(`Ann Taylor`, () => {
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
    payload.internalDate = res.data.internalDate;
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
      const orderData = await AnnTaylor.parse(VENDOR_CODES.ANNTAYLOR, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '112286141906',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Face Mask',
            price: 3.15,
            thumbnail: ''
          },
          {
            name: 'Face Mask',
            price: 3.15,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.ANNTAYLOR,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1\r\n', '2\r\n');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AnnTaylor.parse(VENDOR_CODES.ANNTAYLOR, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '112286141906',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Face Mask (1)',
            price: 3.15,
            thumbnail: ''
          },
          {
            name: 'Face Mask (2)',
            price: 3.15,
            thumbnail: ''
          },
          {
            name: 'Face Mask',
            price: 3.15,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.ANNTAYLOR,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(AnnTaylor.parse(VENDOR_CODES.ANNTAYLOR, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
