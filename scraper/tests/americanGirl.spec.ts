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
import AmericanGirl from '../src/lib/vendors/americanGirl';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/AMERICANGIRL.json';

describe(`American Girl`, () => {
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
      const orderData = await AmericanGirl.parse(VENDOR_CODES.AMERICANGIRL, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'AGP877290',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Beautiful Blooms Pajamas for Bitty Baby Dolls',
            price: 26.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0556/3993/3118/products/xeydyszcgtxwyl7o6x0s_7939b2bb-5fbc-4562-9f6a-fc1be9066fbc_compact_cropped.png?v=1654046026'
          },
          {
            name: 'Bitty’s™ Stackable Birthday Cupcakes Set',
            price: 26.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0556/3993/3118/products/bp906it5ktvtkvoyif8z_compact_cropped.png?v=1656464193'
          }
        ],
        vendor: VENDOR_CODES.AMERICANGIRL,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Quantity: 1', 'Quantity: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AmericanGirl.parse(VENDOR_CODES.AMERICANGIRL, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'AGP877290',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Beautiful Blooms Pajamas for Bitty Baby Dolls (1)',
            price: 26.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0556/3993/3118/products/xeydyszcgtxwyl7o6x0s_7939b2bb-5fbc-4562-9f6a-fc1be9066fbc_compact_cropped.png?v=1654046026'
          },
          {
            name: 'Beautiful Blooms Pajamas for Bitty Baby Dolls (2)',
            price: 26.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0556/3993/3118/products/xeydyszcgtxwyl7o6x0s_7939b2bb-5fbc-4562-9f6a-fc1be9066fbc_compact_cropped.png?v=1654046026'
          },
          {
            name: 'Bitty’s™ Stackable Birthday Cupcakes Set',
            price: 26.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0556/3993/3118/products/bp906it5ktvtkvoyif8z_compact_cropped.png?v=1656464193'
          }
        ],
        vendor: VENDOR_CODES.AMERICANGIRL,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(AmericanGirl.parse(VENDOR_CODES.AMERICANGIRL, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
