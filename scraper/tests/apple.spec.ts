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
import Apple from '../src/lib/vendors/apple';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/APPLE.json';

describe(`Apple`, () => {
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
      const orderData = await Apple.parse(VENDOR_CODES.APPLE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'W690203778',
        orderDate: 1639008000000,
        products: [
          {
            name: 'Lightning to 3.5mm Headphone Jack Adapter',
            price: 9.0,
            thumbnail:
              'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MMX62?wid=192&hei=192&fmt=jpeg&qlt=95&.v=1472256277309'
          }
        ],
        vendor: VENDOR_CODES.APPLE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty 1', 'Qty 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Apple.parse(VENDOR_CODES.APPLE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'W690203778',
        orderDate: 1639008000000,
        products: [
          {
            name: 'Lightning to 3.5mm Headphone Jack Adapter (1)',
            price: 9.0,
            thumbnail:
              'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MMX62?wid=192&hei=192&fmt=jpeg&qlt=95&.v=1472256277309'
          },
          {
            name: 'Lightning to 3.5mm Headphone Jack Adapter (2)',
            price: 9.0,
            thumbnail:
              'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MMX62?wid=192&hei=192&fmt=jpeg&qlt=95&.v=1472256277309'
          }
        ],
        vendor: VENDOR_CODES.APPLE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Apple.parse(VENDOR_CODES.APPLE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
