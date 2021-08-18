import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import BrooksBrothers from '../src/lib/vendors/brooksBrothers';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/BROOKSBROTHERS.json';

describe('BrooksBrothers', () => {
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
      const orderData = await BrooksBrothers.parse(VENDOR_CODES.BROOKSBROTHERS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '30879096',
        orderDate: 0,
        products: [
          {
            name: 'COTTON EYELET TOP',
            thumbnail: 'http://brooksbrothers.scene7.com/is/image/BrooksBrothers/LV00103_NAVY?$bbthumbnail$',
            price: 109.5
          }
        ],
        vendor: VENDOR_CODES.BROOKSBROTHERS,
        emailId: '178d0ddb7d6206f9'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`class="DynDetailsTxt">1`, `class="DynDetailsTxt">3`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await BrooksBrothers.parse(VENDOR_CODES.BROOKSBROTHERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '30879096',
        orderDate: 0,
        products: [
          {
            name: 'COTTON EYELET TOP (1)',
            thumbnail: 'http://brooksbrothers.scene7.com/is/image/BrooksBrothers/LV00103_NAVY?$bbthumbnail$',
            price: 109.5
          },
          {
            name: 'COTTON EYELET TOP (2)',
            thumbnail: 'http://brooksbrothers.scene7.com/is/image/BrooksBrothers/LV00103_NAVY?$bbthumbnail$',
            price: 109.5
          },
          {
            name: 'COTTON EYELET TOP (3)',
            thumbnail: 'http://brooksbrothers.scene7.com/is/image/BrooksBrothers/LV00103_NAVY?$bbthumbnail$',
            price: 109.5
          }
        ],
        vendor: VENDOR_CODES.BROOKSBROTHERS,
        emailId: '178d0ddb7d6206f9'
      });
    });

    it('should return a single product', async () => {
      const orderData = await BrooksBrothers.parse(VENDOR_CODES.BROOKSBROTHERS, payload);
      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(BrooksBrothers.parse(VENDOR_CODES.BROOKSBROTHERS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
