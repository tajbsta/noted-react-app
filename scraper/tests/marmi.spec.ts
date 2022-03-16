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
import Marmi from '../src/lib/vendors/marmi';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/MARMI.json';

describe(`Marmi`, () => {
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
      const orderData = await Marmi.parse(VENDOR_CODES.MARMI, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '100203633',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Vaneli Bounty',
            price: 190.0,
            thumbnail: 'https://cdn1.marmishoes.com/media/catalog/product/4/3/43106420000.jpg'
          },
          {
            name: 'Vaneli Yolen',
            price: 195.0,
            thumbnail: 'https://cdn1.marmishoes.com/media/catalog/product/4/3/43105820000.jpg'
          }
        ],
        vendor: VENDOR_CODES.MARMI,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</p></div>`, `2</p></div>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Marmi.parse(VENDOR_CODES.MARMI, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '100203633',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Vaneli Bounty (1)',
            price: 190.0,
            thumbnail: 'https://cdn1.marmishoes.com/media/catalog/product/4/3/43106420000.jpg'
          },
          {
            name: 'Vaneli Bounty (2)',
            price: 190.0,
            thumbnail: 'https://cdn1.marmishoes.com/media/catalog/product/4/3/43106420000.jpg'
          },
          {
            name: 'Vaneli Yolen',
            price: 195.0,
            thumbnail: 'https://cdn1.marmishoes.com/media/catalog/product/4/3/43105820000.jpg'
          }
        ],
        vendor: VENDOR_CODES.MARMI,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Marmi.parse(VENDOR_CODES.MARMI, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
