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
import Aldo from '../src/lib/vendors/aldo';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/ALDO.json';

describe('Aldo', () => {
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
      const orderData = await Aldo.parse(VENDOR_CODES.ALDO, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '370553382',
        orderDate: 1618358400000,
        products: [
          {
            name: 'KILIWEN',
            thumbnail:
              'https://media.aldoshoes.com/v3/product/kiliwen/220-002-043/kiliwen_brown_220-002-043_main_sq_wt_160x160.jpg',
            price: 80
          }
        ],
        vendor: VENDOR_CODES.ALDO,
        emailId: '178d0c59547b6632'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty. 1.00', 'Qty. 2.00');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Aldo.parse(VENDOR_CODES.ALDO, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '370553382',
        orderDate: 1618358400000,
        products: [
          {
            name: 'KILIWEN (1)',
            thumbnail:
              'https://media.aldoshoes.com/v3/product/kiliwen/220-002-043/kiliwen_brown_220-002-043_main_sq_wt_160x160.jpg',
            price: 80
          },
          {
            name: 'KILIWEN (2)',
            thumbnail:
              'https://media.aldoshoes.com/v3/product/kiliwen/220-002-043/kiliwen_brown_220-002-043_main_sq_wt_160x160.jpg',
            price: 80
          }
        ],
        vendor: VENDOR_CODES.ALDO,
        emailId: '178d0c59547b6632'
      });
    });

    it('should return a single product', async () => {
      const orderData = await Aldo.parse(VENDOR_CODES.ALDO, payload);

      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Aldo.parse(VENDOR_CODES.ALDO, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
