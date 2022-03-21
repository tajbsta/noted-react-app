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
import Evereve from '../src/lib/vendors/evereve';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/EVEREVE.json';

describe(`Evereve`, () => {
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
      const orderData = await Evereve.parse(VENDOR_CODES.EVEREVE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '001230959',
        orderDate: 1646870400000,
        products: [
          {
            name: 'Maya V Neck Tank',
            price: 68.0,
            thumbnail: 'https://d78fj94i6kg8.cloudfront.net/media/catalog/product/e/e/ee9938_white_reshoot_111.jpg'
          },
          {
            name: 'Look At Me Now Seamless Legging',
            price: 68.0,
            thumbnail: 'https://d78fj94i6kg8.cloudfront.net/media/catalog/product/f/l/fl3515-vryblk_11_1.jpeg'
          }
        ],
        vendor: VENDOR_CODES.EVEREVE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        'border-top: 1px solid #ccc; text-align: center;">1</td>',
        'border-top: 1px solid #ccc; text-align: center;">2</td>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Evereve.parse(VENDOR_CODES.EVEREVE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '001230959',
        orderDate: 1646870400000,
        products: [
          {
            name: 'Maya V Neck Tank (1)',
            price: 68.0,
            thumbnail: 'https://d78fj94i6kg8.cloudfront.net/media/catalog/product/e/e/ee9938_white_reshoot_111.jpg'
          },
          {
            name: 'Maya V Neck Tank (2)',
            price: 68.0,
            thumbnail: 'https://d78fj94i6kg8.cloudfront.net/media/catalog/product/e/e/ee9938_white_reshoot_111.jpg'
          },
          {
            name: 'Look At Me Now Seamless Legging',
            price: 68.0,
            thumbnail: 'https://d78fj94i6kg8.cloudfront.net/media/catalog/product/f/l/fl3515-vryblk_11_1.jpeg'
          }
        ],
        vendor: VENDOR_CODES.EVEREVE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Evereve.parse(VENDOR_CODES.EVEREVE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
