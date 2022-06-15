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
import EagleEyeOutfitters from '../src/lib/vendors/eagleEyeOutfitters';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/EAGLEEYEOUTFITTERS.json';

describe(`Eagle Eye Outfitters`, () => {
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
      const orderData = await EagleEyeOutfitters.parse(VENDOR_CODES.EAGLEEYEOUTFITTERS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '100071638',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Original Bogg Bag -  Large',
            price: 89.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-zut1msomd6/product_images/attribute_rule_images/245553_thumb_1644600935.jpg'
          }
        ],
        vendor: VENDOR_CODES.EAGLEEYEOUTFITTERS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`width="100">1</td>`, `width="100">2</td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await EagleEyeOutfitters.parse(VENDOR_CODES.EAGLEEYEOUTFITTERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '100071638',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Original Bogg Bag -  Large (1)',
            price: 89.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-zut1msomd6/product_images/attribute_rule_images/245553_thumb_1644600935.jpg'
          },
          {
            name: 'Original Bogg Bag -  Large (2)',
            price: 89.95,
            thumbnail:
              'https://cdn11.bigcommerce.com/s-zut1msomd6/product_images/attribute_rule_images/245553_thumb_1644600935.jpg'
          }
        ],
        vendor: VENDOR_CODES.EAGLEEYEOUTFITTERS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(EagleEyeOutfitters.parse(VENDOR_CODES.EAGLEEYEOUTFITTERS, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
