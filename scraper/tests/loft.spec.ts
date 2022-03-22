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
import Loft from '../src/lib/vendors/loft';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LOFT.json';

describe(`Loft`, () => {
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
      const orderData = await Loft.parse(VENDOR_CODES.LOFT, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '112341760651',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Boot Socks',
            price: 10.5,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.LOFT,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1\r\n\r\n\r\n</td>', '2\r\n\r\n\r\n</td>');
      updatedPayload.decodedBody = updatedBody;

      const orderData = await Loft.parse(VENDOR_CODES.LOFT, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '112341760651',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Boot Socks (1)',
            price: 10.5,
            thumbnail: ''
          },
          {
            name: 'Boot Socks (2)',
            price: 10.5,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.LOFT,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Loft.parse(VENDOR_CODES.LOFT, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
