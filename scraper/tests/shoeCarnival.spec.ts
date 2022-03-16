import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import ShoeCarnival from '../src/lib/vendors/shoeCarnival';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/SHOECARNIVAL.json';

describe('SHOECARNIVAL', () => {
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
      const orderData = await ShoeCarnival.parse(VENDOR_CODES.SHOECARNIVAL, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '800449001',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Air Max Excee',
            thumbnail:
              'https://www.shoecarnival.com/dw/image/v2/BBSZ_PRD/on/demandware.static/-/Sites-scvl-master-catalog/default/v210528/103699_209603_1.jpg?sw=400&sh=330&sm=fit',
            price: 90
          }
        ],
        vendor: VENDOR_CODES.SHOECARNIVAL,
        emailId: '179b44d4f17868ac'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity: </span>1`, `Quantity: </span>2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await ShoeCarnival.parse(VENDOR_CODES.SHOECARNIVAL, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '800449001',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Air Max Excee (1)',
            thumbnail:
              'https://www.shoecarnival.com/dw/image/v2/BBSZ_PRD/on/demandware.static/-/Sites-scvl-master-catalog/default/v210528/103699_209603_1.jpg?sw=400&sh=330&sm=fit',
            price: 90
          },
          {
            name: 'Air Max Excee (2)',
            thumbnail:
              'https://www.shoecarnival.com/dw/image/v2/BBSZ_PRD/on/demandware.static/-/Sites-scvl-master-catalog/default/v210528/103699_209603_1.jpg?sw=400&sh=330&sm=fit',
            price: 90
          }
        ],
        vendor: VENDOR_CODES.SHOECARNIVAL,
        emailId: '179b44d4f17868ac'
      });
    });

    it('should return a single product', async () => {
      const orderData = await ShoeCarnival.parse(VENDOR_CODES.SHOECARNIVAL, payload);

      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(ShoeCarnival.parse(VENDOR_CODES.SHOECARNIVAL, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
