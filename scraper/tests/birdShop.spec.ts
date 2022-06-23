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
import BirdShop from '../src/lib/vendors/birdShop';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/BIRDSHOP.json';

describe(`Bird Shop`, () => {
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
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BirdShop.parse(VENDOR_CODES.BIRDSHOP, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'BR-6089267414',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'birdie - Jet Black',
            price: 79.2,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0250/6460/3682/products/Artboard1copy121x_compact_cropped.png?v=1617640157'
          }
        ],
        vendor: VENDOR_CODES.BIRDSHOP,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1</span><br/>', '2</span><br/>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BirdShop.parse(VENDOR_CODES.BIRDSHOP, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'BR-6089267414',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'birdie - Jet Black (1)',
            price: 79.2,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0250/6460/3682/products/Artboard1copy121x_compact_cropped.png?v=1617640157'
          },
          {
            name: 'birdie - Jet Black (2)',
            price: 79.2,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0250/6460/3682/products/Artboard1copy121x_compact_cropped.png?v=1617640157'
          }
        ],
        vendor: VENDOR_CODES.BIRDSHOP,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(BirdShop.parse(VENDOR_CODES.BIRDSHOP, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
