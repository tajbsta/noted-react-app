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
import Sundance from '../src/lib/vendors/sundance';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/SUNDANCE.json';

describe.only('Sundance', () => {
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
      const orderData = await Sundance.parse(VENDOR_CODES.SUNDANCE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '21815983',
        orderDate: 0,
        products: [
          {
            name: 'STOCKING STYLE 4',
            price: 98.0,
            thumbnail:
              'http://ii.sundancecatalog.com/fcgi-bin/iipsrv.fcgi?FIF=/images/sundance/source/products/en_us/source/99031.tif&wid=100&cvt=jpeg'
          },
          {
            name: 'BLACK/GOLD SATIN 4PC CHEESE SET',
            price: 58.0,
            thumbnail:
              'http://ii.sundancecatalog.com/fcgi-bin/iipsrv.fcgi?FIF=/images/sundance/source/products/en_us/source/98281.tif&wid=100&cvt=jpeg'
          }
        ],
        vendor: VENDOR_CODES.SUNDANCE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`(1)</a></p>`, `(2)</a></p>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Sundance.parse(VENDOR_CODES.SUNDANCE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '21815983',
        orderDate: 0,
        products: [
          {
            name: 'STOCKING STYLE 4 (1)',
            price: 98.0,
            thumbnail:
              'http://ii.sundancecatalog.com/fcgi-bin/iipsrv.fcgi?FIF=/images/sundance/source/products/en_us/source/99031.tif&wid=100&cvt=jpeg'
          },
          {
            name: 'STOCKING STYLE 4 (2)',
            price: 98.0,
            thumbnail:
              'http://ii.sundancecatalog.com/fcgi-bin/iipsrv.fcgi?FIF=/images/sundance/source/products/en_us/source/99031.tif&wid=100&cvt=jpeg'
          },
          {
            name: 'BLACK/GOLD SATIN 4PC CHEESE SET',
            price: 58.0,
            thumbnail:
              'http://ii.sundancecatalog.com/fcgi-bin/iipsrv.fcgi?FIF=/images/sundance/source/products/en_us/source/98281.tif&wid=100&cvt=jpeg'
          }
        ],
        vendor: VENDOR_CODES.SUNDANCE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Sundance.parse(VENDOR_CODES.SUNDANCE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
