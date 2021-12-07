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
import Forever21 from '../src/lib/vendors/forever21';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/FOREVER21.json';

describe(`Forever 21`, () => {
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
      const orderData = await Forever21.parse(VENDOR_CODES.FOREVER21, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '8100308025',
        orderDate: 1602979200000,
        products: [
          {
            name: 'Ruched Cap Sleeve Top',
            price: 22.99,
            thumbnail:
              'https://www.forever21.com/on/demandware.static/-/Sites-f21-master-catalog/default/dw88bd9919/1_front_750/00433214-07.jpg'
          },
          {
            name: 'Smocked Chiffon Top',
            price: 24.99,
            thumbnail:
              'https://www.forever21.com/on/demandware.static/-/Sites-f21-master-catalog/default/dw364058f4/1_front_750/00443731-02.jpg'
          }
        ],
        vendor: VENDOR_CODES.FOREVER21,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty: 1', 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Forever21.parse(VENDOR_CODES.FOREVER21, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '8100308025',
        orderDate: 1602979200000,
        products: [
          {
            name: 'Ruched Cap Sleeve Top (1)',
            price: 22.99,
            thumbnail:
              'https://www.forever21.com/on/demandware.static/-/Sites-f21-master-catalog/default/dw88bd9919/1_front_750/00433214-07.jpg'
          },
          {
            name: 'Ruched Cap Sleeve Top (2)',
            price: 22.99,
            thumbnail:
              'https://www.forever21.com/on/demandware.static/-/Sites-f21-master-catalog/default/dw88bd9919/1_front_750/00433214-07.jpg'
          },
          {
            name: 'Smocked Chiffon Top',
            price: 24.99,
            thumbnail:
              'https://www.forever21.com/on/demandware.static/-/Sites-f21-master-catalog/default/dw364058f4/1_front_750/00443731-02.jpg'
          }
        ],
        vendor: VENDOR_CODES.FOREVER21,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Forever21.parse(VENDOR_CODES.FOREVER21, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
