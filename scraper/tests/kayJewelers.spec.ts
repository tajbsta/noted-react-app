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
import KayJewelers from '../src/lib/vendors/kayJewelers';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/KAYJEWELERS.json';

describe.only(`Kay Jewelers`, () => {
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
      const orderData = await KayJewelers.parse(VENDOR_CODES.KAYJEWELERS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '10000351664772',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Lab-Created Emerald Stud Earrings Sterling Silver',
            price: 69.99,
            thumbnail: ''
          },
          {
            name: 'Ball Earrings Sterling Silver 10mm',
            price: 24.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.KAYJEWELERS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`<p>Quantity:&nbsp;1</p>`, `<p>Quantity:&nbsp;2</p>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await KayJewelers.parse(VENDOR_CODES.KAYJEWELERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '10000351664772',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Lab-Created Emerald Stud Earrings Sterling Silver (1)',
            price: 69.99,
            thumbnail: ''
          },
          {
            name: 'Lab-Created Emerald Stud Earrings Sterling Silver (2)',
            price: 69.99,
            thumbnail: ''
          },
          {
            name: 'Ball Earrings Sterling Silver 10mm',
            price: 24.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.KAYJEWELERS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(KayJewelers.parse(VENDOR_CODES.KAYJEWELERS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
