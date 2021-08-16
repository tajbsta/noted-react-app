import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import KMCCARTHY from '../src/lib/vendors/kMccarthy';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/KMCCARTHY.json';

describe('KMCCARTHY', () => {
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
      const orderData = await KMCCARTHY.parse(VENDOR_CODES.KMCCARTHY, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2422',
        orderDate: 0,
        products: [
          {
            name: 'Macen Sandals',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0262/2609/8221/products/DOLCEVITA-SANDALS_MACEN_BONE_2000x2400_1472bf9b-d00e-4225-bbba-3fe512e617d5_compact_cropped.jpg?v=1615422069',
            price: 128
          },
          {
            name: 'Studded Bow Sandals',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0262/2609/8221/products/ScreenShot2020-07-16at2.15.30PM_compact_cropped.png?v=1594927587',
            price: 38
          }
        ],
        vendor: VENDOR_CODES.KMCCARTHY,
        emailId: '178a37e9f2131455'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      const regexToSearchFor = new RegExp('1</span>', 'g');

      updatedBody = updatedBody.replace(regexToSearchFor, '2</span>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await KMCCARTHY.parse(VENDOR_CODES.KMCCARTHY, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2422',
        orderDate: 0,
        products: [
          {
            name: 'Macen Sandals (1)',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0262/2609/8221/products/DOLCEVITA-SANDALS_MACEN_BONE_2000x2400_1472bf9b-d00e-4225-bbba-3fe512e617d5_compact_cropped.jpg?v=1615422069',
            price: 128
          },
          {
            name: 'Macen Sandals (2)',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0262/2609/8221/products/DOLCEVITA-SANDALS_MACEN_BONE_2000x2400_1472bf9b-d00e-4225-bbba-3fe512e617d5_compact_cropped.jpg?v=1615422069',
            price: 128
          },
          {
            name: 'Studded Bow Sandals (1)',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0262/2609/8221/products/ScreenShot2020-07-16at2.15.30PM_compact_cropped.png?v=1594927587',
            price: 38
          },
          {
            name: 'Studded Bow Sandals (2)',
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0262/2609/8221/products/ScreenShot2020-07-16at2.15.30PM_compact_cropped.png?v=1594927587',
            price: 38
          }
        ],
        vendor: VENDOR_CODES.KMCCARTHY,
        emailId: '178a37e9f2131455'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(KMCCARTHY.parse(VENDOR_CODES.KMCCARTHY, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
