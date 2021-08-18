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
import OldNavy from '../src/lib/vendors/oldNavy';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/OLDNAVY.json';

describe('OLDNAVY', () => {
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
      const orderData = await OldNavy.parse(VENDOR_CODES.OLDNAVY, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '153Y6GN',
        orderDate: 1622505600000,
        products: [
          {
            name: 'Mid-Rise Tie-Dyed Boyfriend Jean Shorts for Women -- 3-inch inseam',
            thumbnail: '',
            price: 12
          },
          {
            name: 'First-Layer Fitted Tank for Women',
            thumbnail: '',
            price: 6
          }
        ],
        vendor: VENDOR_CODES.OLDNAVY,
        emailId: '179c8976c4a5c9aa'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `line-height:22.5px;color:#666666;">1</td>`,
        `line-height:22.5px;color:#666666;">2</td>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await OldNavy.parse(VENDOR_CODES.OLDNAVY, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '153Y6GN',
        orderDate: 1622505600000,
        products: [
          {
            name: 'Mid-Rise Tie-Dyed Boyfriend Jean Shorts for Women -- 3-inch inseam (1)',
            thumbnail: '',
            price: 12
          },
          {
            name: 'Mid-Rise Tie-Dyed Boyfriend Jean Shorts for Women -- 3-inch inseam (2)',
            thumbnail: '',
            price: 12
          },
          {
            name: 'First-Layer Fitted Tank for Women',
            thumbnail: '',
            price: 6
          }
        ],
        vendor: VENDOR_CODES.OLDNAVY,
        emailId: '179c8976c4a5c9aa'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(OldNavy.parse(VENDOR_CODES.OLDNAVY, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
