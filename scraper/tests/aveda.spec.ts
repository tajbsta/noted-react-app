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
import Aveda from '../src/lib/vendors/aveda';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/AVEDA.json';

describe(`Aveda`, () => {
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
      const orderData = await Aveda.parse(VENDOR_CODES.AVEDA, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '4082305676',
        orderDate: 0,
        products: [
          {
            name: 'lip saver™ .15 oz/4.25g',
            price: 10.0,
            thumbnail: 'http://www.aveda.com/media/images/products/171x289/av_sku_AF4M01_50785_171x289_0.jpg'
          },
          {
            name: 'pencil sharpener',
            price: 5.0,
            thumbnail: 'http://www.aveda.com/media/images/products/171x289/av_sku_AAAT01_38525_171x289_0.jpg'
          }
        ],
        vendor: VENDOR_CODES.AVEDA,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        '<td class="qty" style= "padding: 10px; color: #120E02; text-align: center; width: 80px;vertical-align: top;">1</td>',
        '<td class="qty" style= "padding: 10px; color: #120E02; text-align: center; width: 80px;vertical-align: top;">2</td>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Aveda.parse(VENDOR_CODES.AVEDA, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '4082305676',
        orderDate: 0,
        products: [
          {
            name: 'lip saver™ .15 oz/4.25g (1)',
            price: 10.0,
            thumbnail: 'http://www.aveda.com/media/images/products/171x289/av_sku_AF4M01_50785_171x289_0.jpg'
          },
          {
            name: 'lip saver™ .15 oz/4.25g (2)',
            price: 10.0,
            thumbnail: 'http://www.aveda.com/media/images/products/171x289/av_sku_AF4M01_50785_171x289_0.jpg'
          },
          {
            name: 'pencil sharpener',
            price: 5.0,
            thumbnail: 'http://www.aveda.com/media/images/products/171x289/av_sku_AAAT01_38525_171x289_0.jpg'
          }
        ],
        vendor: VENDOR_CODES.AVEDA,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Aveda.parse(VENDOR_CODES.AVEDA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
