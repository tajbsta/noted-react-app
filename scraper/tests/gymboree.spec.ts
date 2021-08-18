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
import Gymboree from '../src/lib/vendors/gymboree';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/GYMBOREE.json';

describe('Gymboree', () => {
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
      const orderData = await Gymboree.parse(VENDOR_CODES.GYMBOREE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '361718913',
        orderDate: 1618531200000,
        products: [
          {
            name: 'Girls Madras Shift Dress - American Cutie',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3012057/3012057_32L4.jpg',
            price: 37.46
          },
          {
            name: 'Girls Floral Dress - Sunny Daisies',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3011943/3011943_1106.jpg',
            price: 15.98
          },
          {
            name: 'Girls Embroidered Rainbow Denim Shortalls - Sunshine Time',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3019777/3019777_DB.jpg',
            price: 15.98
          },
          {
            name: 'Unisex Striped Star Cotton 2-Piece Pajamas - Gymmies',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3020654/3020654_32L4.jpg',
            price: 20.97
          },
          {
            name: 'Girls Butterfly Cotton 2-Piece Pajamas - Gymmies',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3019088/3019088_BQ.jpg',
            price: 11.98
          },
          {
            name: 'Girls Flamingo Cotton 2-Piece Pajamas - Gymmies (1)',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3020739/3020739_1351.jpg',
            price: 14.98
          },
          {
            name: 'Girls Flamingo Cotton 2-Piece Pajamas - Gymmies (2)',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3020739/3020739_1351.jpg',
            price: 14.98
          },
          {
            name: 'Girls Star Bucket Hat - American Cutie',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3012068/3012068_BQ.jpg',
            price: 14.96
          },
          {
            name: 'Girls Sparkle Bow Sandals',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3019684/3019684_1128.jpg',
            price: 13.17
          }
        ],
        vendor: VENDOR_CODES.GYMBOREE,
        emailId: '178dd249e7aff9e7'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`font-size: 14px;">1</td>`, `font-size: 14px;">2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Gymboree.parse(VENDOR_CODES.GYMBOREE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '361718913',
        orderDate: 1618531200000,
        products: [
          {
            name: 'Girls Madras Shift Dress - American Cutie (1)',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3012057/3012057_32L4.jpg',
            price: 37.46
          },
          {
            name: 'Girls Madras Shift Dress - American Cutie (2)',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3012057/3012057_32L4.jpg',
            price: 37.46
          },
          {
            name: 'Girls Floral Dress - Sunny Daisies',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3011943/3011943_1106.jpg',
            price: 15.98
          },
          {
            name: 'Girls Embroidered Rainbow Denim Shortalls - Sunshine Time',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3019777/3019777_DB.jpg',
            price: 15.98
          },
          {
            name: 'Unisex Striped Star Cotton 2-Piece Pajamas - Gymmies',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3020654/3020654_32L4.jpg',
            price: 20.97
          },
          {
            name: 'Girls Butterfly Cotton 2-Piece Pajamas - Gymmies',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3019088/3019088_BQ.jpg',
            price: 11.98
          },
          {
            name: 'Girls Flamingo Cotton 2-Piece Pajamas - Gymmies (1)',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3020739/3020739_1351.jpg',
            price: 14.98
          },
          {
            name: 'Girls Flamingo Cotton 2-Piece Pajamas - Gymmies (2)',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3020739/3020739_1351.jpg',
            price: 14.98
          },
          {
            name: 'Girls Star Bucket Hat - American Cutie',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3012068/3012068_BQ.jpg',
            price: 14.96
          },
          {
            name: 'Girls Sparkle Bow Sandals',
            thumbnail:
              'https://assets.theplace.com/image/upload/w_200,f_auto,q_auto/v1/ecom/assets/products/gym/3019684/3019684_1128.jpg',
            price: 13.17
          }
        ],
        vendor: VENDOR_CODES.GYMBOREE,
        emailId: '178dd249e7aff9e7'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Gymboree.parse(VENDOR_CODES.GYMBOREE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
