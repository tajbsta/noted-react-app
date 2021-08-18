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
import Skechers from '../src/lib/vendors/skechers';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/SKECHERS.json';

describe('SKECHERS', () => {
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
      const orderData = await Skechers.parse(VENDOR_CODES.SKECHERS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '22648229',
        orderDate: 1622505600000,
        products: [
          {
            name: 'Foamies: Footsteps - Breezy Feels',
            thumbnail: 'https://image.skechers.com/img/productimages/large/111054_WHT.jpg',
            price: 27.99
          },
          {
            name: 'Foamies: Cali Breeze 2.0 - Cat-Cha Later',
            thumbnail: 'https://image.skechers.com/img/productimages/large/111015_WHT.jpg',
            price: 27.99
          }
        ],
        vendor: VENDOR_CODES.SKECHERS,
        emailId: '179c8a206ad7b715'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`QUANTITY:</strong> 1`, `QUANTITY:</strong> 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Skechers.parse(VENDOR_CODES.SKECHERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '22648229',
        orderDate: 1622505600000,
        products: [
          {
            name: 'Foamies: Footsteps - Breezy Feels (1)',
            thumbnail: 'https://image.skechers.com/img/productimages/large/111054_WHT.jpg',
            price: 27.99
          },
          {
            name: 'Foamies: Footsteps - Breezy Feels (2)',
            thumbnail: 'https://image.skechers.com/img/productimages/large/111054_WHT.jpg',
            price: 27.99
          },
          {
            name: 'Foamies: Cali Breeze 2.0 - Cat-Cha Later',
            thumbnail: 'https://image.skechers.com/img/productimages/large/111015_WHT.jpg',
            price: 27.99
          }
        ],
        vendor: VENDOR_CODES.SKECHERS,
        emailId: '179c8a206ad7b715'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Skechers.parse(VENDOR_CODES.SKECHERS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
