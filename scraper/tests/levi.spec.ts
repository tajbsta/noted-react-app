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
import Levi from '../src/lib/vendors/levi';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/LEVI.json';

describe('LEVI', () => {
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
      const orderData = await Levi.parse(VENDOR_CODES.LEVI, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '108655495',
        orderDate: 1618963200000,
        products: [
          {
            name: 'High Neck Tank Top',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/197060004-front-pdp',
            price: 29.5
          },
          {
            name: 'Mid Length Womens Shorts',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/299650054-dynamic1-pdp',
            price: 44.5
          },
          {
            name: 'Toddler Girls 2T-4T Shortalls',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/373410056-front-pdp',
            price: 44
          }
        ],
        vendor: VENDOR_CODES.LEVI,
        emailId: '178f713859eaa4ec'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('QTY:&nbsp;1', 'QTY:&nbsp;2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Levi.parse(VENDOR_CODES.LEVI, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '108655495',
        orderDate: 1618963200000,
        products: [
          {
            name: 'High Neck Tank Top (1)',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/197060004-front-pdp',
            price: 29.5
          },
          {
            name: 'High Neck Tank Top (2)',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/197060004-front-pdp',
            price: 29.5
          },
          {
            name: 'Mid Length Womens Shorts',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/299650054-dynamic1-pdp',
            price: 44.5
          },
          {
            name: 'Toddler Girls 2T-4T Shortalls',
            thumbnail: 'https://lsco.scene7.com/is/image/lsco/373410056-front-pdp',
            price: 44
          }
        ],
        vendor: VENDOR_CODES.LEVI,
        emailId: '178f713859eaa4ec'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Levi.parse(VENDOR_CODES.LEVI, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
