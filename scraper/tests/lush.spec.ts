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
import Lush from '../src/lib/vendors/lush';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LUSH.json';

describe('Lush', () => {
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
      const orderData = await Lush.parse(VENDOR_CODES.LUSH, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'P204931638',
        orderDate: 1622937600000,
        products: [
          {
            name: 'Dream Cream',
            price: 7.95,
            thumbnail:
              'https://www.lushusa.com/on/demandware.static/-/Sites-lushcosmetics-export/default/dwffb0d021/images/product/00031_1.jpg'
          },
          {
            name: 'Renee´s Shea Souffle',
            price: 16.95,
            thumbnail:
              'https://www.lushusa.com/on/demandware.static/-/Sites-lushcosmetics-export/default/dw7a14ec54/images/product/60540.jpg'
          }
        ],
        vendor: VENDOR_CODES.LUSH,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`<div>qty: 1</div>`, `<div>qty: 2</div>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Lush.parse(VENDOR_CODES.LUSH, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'P204931638',
        orderDate: 1622937600000,
        products: [
          {
            name: 'Dream Cream (1)',
            price: 7.95,
            thumbnail:
              'https://www.lushusa.com/on/demandware.static/-/Sites-lushcosmetics-export/default/dwffb0d021/images/product/00031_1.jpg'
          },
          {
            name: 'Dream Cream (2)',
            price: 7.95,
            thumbnail:
              'https://www.lushusa.com/on/demandware.static/-/Sites-lushcosmetics-export/default/dwffb0d021/images/product/00031_1.jpg'
          },
          {
            name: 'Renee´s Shea Souffle',
            price: 16.95,
            thumbnail:
              'https://www.lushusa.com/on/demandware.static/-/Sites-lushcosmetics-export/default/dw7a14ec54/images/product/60540.jpg'
          }
        ],
        vendor: VENDOR_CODES.LUSH,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Lush.parse(VENDOR_CODES.LUSH, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
