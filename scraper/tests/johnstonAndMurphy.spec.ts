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
import JohnstonAndMurphy from '../src/lib/vendors/johnstonAndMurphy';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/JOHNSTONANDMURPHY.json';

describe(`Johnston and Murphy`, () => {
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
      const orderData = await JohnstonAndMurphy.parse(VENDOR_CODES.JOHNSTONANDMURPHY, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '502133622',
        orderDate: 1634860800000,
        products: [
          {
            name: 'High-Rise Liner Sock',
            price: 8.0,
            thumbnail: ''
          },
          {
            name: 'XC4® Performance Golf Socks',
            price: 14.0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.JOHNSTONANDMURPHY,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<td style="vertical-align: top; padding: 10px 0px;">\r\n1\r\n</td>`,
        `<td style="vertical-align: top; padding: 10px 0px;">\r\n2\r\n</td>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JohnstonAndMurphy.parse(VENDOR_CODES.JOHNSTONANDMURPHY, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '502133622',
        orderDate: 1634860800000,
        products: [
          {
            name: 'High-Rise Liner Sock (1)',
            price: 8.0,
            thumbnail: ''
          },
          {
            name: 'High-Rise Liner Sock (2)',
            price: 8.0,
            thumbnail: ''
          },
          {
            name: 'XC4® Performance Golf Socks',
            price: 14.0,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.JOHNSTONANDMURPHY,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JohnstonAndMurphy.parse(VENDOR_CODES.JOHNSTONANDMURPHY, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
