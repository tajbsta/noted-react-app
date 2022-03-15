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
import JJill from '../src/lib/vendors/jjill';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/JJILL.json';

describe(`J Jill`, () => {
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
      const orderData = await JJill.parse(VENDOR_CODES.JJILL, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '10438429',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Autumn Accents Earrings',
            price: 29.0,
            thumbnail: 'https://content.jjill.com/product/236681/236681_1KE.jpg?impolicy=thumb250'
          },
          {
            name: 'Autumn Accents Leaf Earrings',
            price: 29.0,
            thumbnail: 'https://content.jjill.com/product/237231/237231_44Q.jpg?impolicy=thumb250'
          }
        ],
        vendor: VENDOR_CODES.JJILL,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JJill.parse(VENDOR_CODES.JJILL, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '10438429',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Autumn Accents Earrings',
            price: 29.0,
            thumbnail: 'https://content.jjill.com/product/236681/236681_1KE.jpg?impolicy=thumb250'
          },
          {
            name: 'Autumn Accents Leaf Earrings',
            price: 29.0,
            thumbnail: 'https://content.jjill.com/product/237231/237231_44Q.jpg?impolicy=thumb250'
          }
        ],
        vendor: VENDOR_CODES.JJILL,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JJill.parse(VENDOR_CODES.JJILL, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
