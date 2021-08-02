import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import UnderArmour from '../src/lib/vendors/underArmour';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/UNDERARMOUR.json';

describe('UNDERARMOUR', () => {
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
      const orderData = await UnderArmour.parse(VENDOR_CODES.UNDERARMOUR, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'US-05438313',
        orderDate: 0,
        products: [
          {
            name: "Girls' HeatGear® Armour Sports Bra",
            thumbnail:
              'https://underarmour.scene7.com/is/image/Underarmour/PS1362877-001_HF?rp=standard-0pad|pdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=566&hei=708&size=566,708',
            price: 15.99
          }
        ],
        vendor: VENDOR_CODES.UNDERARMOUR,
        emailId: '1790f2971846f8d0'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`x 1`, `x 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await UnderArmour.parse(VENDOR_CODES.UNDERARMOUR, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'US-05438313',
        orderDate: 0,
        products: [
          {
            name: "Girls' HeatGear® Armour Sports Bra (1)",
            thumbnail:
              'https://underarmour.scene7.com/is/image/Underarmour/PS1362877-001_HF?rp=standard-0pad|pdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=566&hei=708&size=566,708',
            price: 15.99
          },
          {
            name: "Girls' HeatGear® Armour Sports Bra (2)",
            thumbnail:
              'https://underarmour.scene7.com/is/image/Underarmour/PS1362877-001_HF?rp=standard-0pad|pdpMainDesktop&scl=1&fmt=jpg&qlt=85&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=566&hei=708&size=566,708',
            price: 15.99
          }
        ],
        vendor: VENDOR_CODES.UNDERARMOUR,
        emailId: '1790f2971846f8d0'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(UnderArmour.parse(VENDOR_CODES.UNDERARMOUR, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
