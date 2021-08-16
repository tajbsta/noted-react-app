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
import Soma from '../src/lib/vendors/soma';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/SOMA.json';

describe('SOMA', () => {
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
      const orderData = await Soma.parse(VENDOR_CODES.SOMA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '213903207',
        orderDate: 1622160000000,
        products: [
          {
            name: 'Embraceable Reversible Lounge Bralette',
            thumbnail: 'https://www.soma.com/Product_Images/570296558_3769_thumb.jpg',
            price: 17.99
          },
          {
            name: 'Embraceable Reversible Lounge Bralette',
            thumbnail: 'https://www.soma.com/Product_Images/570296558_4147_thumb.jpg',
            price: 14.99
          }
        ],
        vendor: VENDOR_CODES.SOMA,
        emailId: '179b4b48f13e1e8e'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`12px">1</span>`, `12px">2</span>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Soma.parse(VENDOR_CODES.SOMA, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '213903207',
        orderDate: 1622160000000,
        products: [
          {
            name: 'Embraceable Reversible Lounge Bralette (1)',
            thumbnail: 'https://www.soma.com/Product_Images/570296558_3769_thumb.jpg',
            price: 17.99
          },
          {
            name: 'Embraceable Reversible Lounge Bralette (2)',
            thumbnail: 'https://www.soma.com/Product_Images/570296558_3769_thumb.jpg',
            price: 17.99
          },
          {
            name: 'Embraceable Reversible Lounge Bralette',
            thumbnail: 'https://www.soma.com/Product_Images/570296558_4147_thumb.jpg',
            price: 14.99
          }
        ],
        vendor: VENDOR_CODES.SOMA,
        emailId: '179b4b48f13e1e8e'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Soma.parse(VENDOR_CODES.SOMA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
