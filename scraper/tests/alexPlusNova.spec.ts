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
import AlexPlusNova from '../src/lib/vendors/alexPlusNova';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/ALEXPLUSNOVA.json';

describe('AlexPlusNova', () => {
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
      const orderData = await AlexPlusNova.parse(VENDOR_CODES.ALEXPLUSNOVA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'AN100189617',
        orderDate: 1652918400000,
        products: [
          {
            name: 'Newborn Baby Cotton Gift Set',
            price: 179.95,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0108/5675/9353/products/newborn-baby-cotton-gift-set-set-of-1822-set-alex-nova-22-pieces-pink-thick-391064_140x@3x.jpg?v=1617636753'
          }
        ],
        vendor: VENDOR_CODES.ALEXPLUSNOVA,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</p>`, `2</p>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AlexPlusNova.parse(VENDOR_CODES.ALEXPLUSNOVA, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'AN100189617',
        orderDate: 1652918400000,
        products: [
          {
            name: 'Newborn Baby Cotton Gift Set (1)',
            price: 179.95,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0108/5675/9353/products/newborn-baby-cotton-gift-set-set-of-1822-set-alex-nova-22-pieces-pink-thick-391064_140x@3x.jpg?v=1617636753'
          },
          {
            name: 'Newborn Baby Cotton Gift Set (2)',
            price: 179.95,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0108/5675/9353/products/newborn-baby-cotton-gift-set-set-of-1822-set-alex-nova-22-pieces-pink-thick-391064_140x@3x.jpg?v=1617636753'
          }
        ],
        vendor: VENDOR_CODES.ALEXPLUSNOVA,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(AlexPlusNova.parse(VENDOR_CODES.ALEXPLUSNOVA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
