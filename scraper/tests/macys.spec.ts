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
import Macys from '../src/lib/vendors/macys';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/MACYS.json';

describe('MACYS', () => {
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
      const orderData = await Macys.parse(VENDOR_CODES.MACYS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1992319083',
        orderDate: 1583625600000,
        products: [
          {
            name: "adidas Women's Originals Swift Run Casual Sneakers from Finish Line",
            thumbnail:
              'http://slimages.macys.com/is/image/MCY/products/4/optimized/10319284_fpx.tif?bgc=255,255,255&wid=100&qlt=90&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            price: 85
          },
          {
            name: "adidas Women's Originals Swift Run Casual Sneakers from Finish Line",
            thumbnail:
              'http://slimages.macys.com/is/image/MCY/products/2/optimized/12359292_fpx.tif?bgc=255,255,255&wid=100&qlt=90&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            price: 84.99
          }
        ],
        vendor: VENDOR_CODES.MACYS,
        emailId: '170bb8292180f175'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Macys.parse(VENDOR_CODES.MACYS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1992319083',
        orderDate: 1583625600000,
        products: [
          {
            name: "adidas Women's Originals Swift Run Casual Sneakers from Finish Line (1)",
            thumbnail:
              'http://slimages.macys.com/is/image/MCY/products/4/optimized/10319284_fpx.tif?bgc=255,255,255&wid=100&qlt=90&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            price: 85
          },
          {
            name: "adidas Women's Originals Swift Run Casual Sneakers from Finish Line (2)",
            thumbnail:
              'http://slimages.macys.com/is/image/MCY/products/4/optimized/10319284_fpx.tif?bgc=255,255,255&wid=100&qlt=90&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            price: 85
          },
          {
            name: "adidas Women's Originals Swift Run Casual Sneakers from Finish Line",
            thumbnail:
              'http://slimages.macys.com/is/image/MCY/products/2/optimized/12359292_fpx.tif?bgc=255,255,255&wid=100&qlt=90&layer=comp&op_sharpen=0&resMode=bicub&op_usm=0.7,1.0,0.5,0&fmt=jpeg',
            price: 84.99
          }
        ],
        vendor: VENDOR_CODES.MACYS,
        emailId: '170bb8292180f175'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Macys.parse(VENDOR_CODES.MACYS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
