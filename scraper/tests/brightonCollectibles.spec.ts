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
import BrightonCollectibles from '../src/lib/vendors/brightonCollectibles';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/BRIGHTONCOLLECTIBLES.json';

describe.only(`Brighton Collectibles`, () => {
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
      const orderData = await BrightonCollectibles.parse(VENDOR_CODES.BRIGHTONCOLLECTIBLES, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2129914',
        orderDate: 0,
        products: [
          {
            name: 'BRIGHTON MINTS',
            price: 2.5,
            thumbnail: 'https://www.brighton.com/photos/product/standard/369560S238726/small-collectibles/size-os.jpg'
          },
          {
            name: 'BRIGHTON YOUR DAY HAND SANITIZER',
            price: 3.0,
            thumbnail: 'https://www.brighton.com/photos/product/standard/369560S248593/small-collectibles/size-os.jpg'
          }
        ],
        vendor: VENDOR_CODES.BRIGHTONCOLLECTIBLES,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Quantity: 1<br>', 'Quantity: 2<br>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BrightonCollectibles.parse(VENDOR_CODES.BRIGHTONCOLLECTIBLES, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2129914',
        orderDate: 0,
        products: [
          {
            name: 'BRIGHTON MINTS (1)',
            price: 2.5,
            thumbnail: 'https://www.brighton.com/photos/product/standard/369560S238726/small-collectibles/size-os.jpg'
          },
          {
            name: 'BRIGHTON MINTS (2)',
            price: 2.5,
            thumbnail: 'https://www.brighton.com/photos/product/standard/369560S238726/small-collectibles/size-os.jpg'
          },
          {
            name: 'BRIGHTON YOUR DAY HAND SANITIZER',
            price: 3.0,
            thumbnail: 'https://www.brighton.com/photos/product/standard/369560S248593/small-collectibles/size-os.jpg'
          }
        ],
        vendor: VENDOR_CODES.BRIGHTONCOLLECTIBLES,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(
        BrightonCollectibles.parse(VENDOR_CODES.BRIGHTONCOLLECTIBLES, updatedPayload)
      ).to.eventually.be.rejectedWith(Error);
    });
  });
});
