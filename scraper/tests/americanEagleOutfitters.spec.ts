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
import AmericanEagleOutfitters from '../src/lib/vendors/americanEagleOutfitters';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/AMERICANEAGLEOUTFITTERS.json';

describe('AmericanEagleOutfitters', () => {
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
      const orderData = await AmericanEagleOutfitters.parse(VENDOR_CODES.AMERICANEAGLEOUTFITTERS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6151708900',
        orderDate: 1546473600000,
        products: [
          {
            name: 'Aerie Track Scoop Bikini Top',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/0753_1497_006_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          },
          {
            name: 'Aerie High Waisted Bikini Bottom',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/1756_1498_006_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          },
          {
            name: 'Aerie Scoop Bikini Top',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/0753_1381_100_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 12.47
          },
          {
            name: 'Aerie Cheeky Bikini Bottom',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/1754_1370_100_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 9.97
          },
          {
            name: 'Aerie Real Happy Plunge Push Up Bra',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/3731_4774_073_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          }
        ],
        vendor: VENDOR_CODES.AMERICANEAGLEOUTFITTERS,
        emailId: '1681656a5723a30c'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty: 1', 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AmericanEagleOutfitters.parse(VENDOR_CODES.AMERICANEAGLEOUTFITTERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6151708900',
        orderDate: 1546473600000,
        products: [
          {
            name: 'Aerie Track Scoop Bikini Top (1)',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/0753_1497_006_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          },
          {
            name: 'Aerie Track Scoop Bikini Top (2)',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/0753_1497_006_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          },
          {
            name: 'Aerie High Waisted Bikini Bottom',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/1756_1498_006_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          },
          {
            name: 'Aerie Scoop Bikini Top',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/0753_1381_100_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 12.47
          },
          {
            name: 'Aerie Cheeky Bikini Bottom',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/1754_1370_100_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 9.97
          },
          {
            name: 'Aerie Real Happy Plunge Push Up Bra',
            thumbnail: 'http://s7d2.scene7.com/is/image/aeo/3731_4774_073_f?fit=crop&wid=300&hei=390&qlt=100,0',
            price: 14.97
          }
        ],
        vendor: VENDOR_CODES.AMERICANEAGLEOUTFITTERS,
        emailId: '1681656a5723a30c'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(
        AmericanEagleOutfitters.parse(VENDOR_CODES.AMERICANEAGLEOUTFITTERS, updatedPayload)
      ).to.eventually.be.rejectedWith(Error);
    });
  });
});
