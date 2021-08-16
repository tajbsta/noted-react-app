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
import KOHLS from '../src/lib/vendors/kohls';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/KOHLS.json';

describe('KOHLS', () => {
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
      const orderData = await KOHLS.parse(VENDOR_CODES.KOHLS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6150781638',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Multi Colored Hair Clip',
            thumbnail: 'https://media.kohlsimg.com/is/image/kohls/3770662?wid=350&hei=350&op_sharpen=1',
            price: 8.99
          },
          {
            name: 'The Big One® Oversized Supersoft Plush Throw',
            thumbnail: 'https://media.kohlsimg.com/is/image/kohls/1944597_Pink_Dye_Effect?wid=180&hei=180&op_sharpen=1',
            price: 19.99
          }
        ],
        vendor: VENDOR_CODES.KOHLS,
        emailId: '178f02124c783be7'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Qty: 1`, `Qty: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await KOHLS.parse(VENDOR_CODES.KOHLS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '6150781638',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Multi Colored Hair Clip (1)',
            thumbnail: 'https://media.kohlsimg.com/is/image/kohls/3770662?wid=350&hei=350&op_sharpen=1',
            price: 8.99
          },
          {
            name: 'Multi Colored Hair Clip (2)',
            thumbnail: 'https://media.kohlsimg.com/is/image/kohls/3770662?wid=350&hei=350&op_sharpen=1',
            price: 8.99
          },
          {
            name: 'The Big One® Oversized Supersoft Plush Throw',
            thumbnail: 'https://media.kohlsimg.com/is/image/kohls/1944597_Pink_Dye_Effect?wid=180&hei=180&op_sharpen=1',
            price: 19.99
          }
        ],
        vendor: VENDOR_CODES.KOHLS,
        emailId: '178f02124c783be7'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(KOHLS.parse(VENDOR_CODES.KOHLS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
