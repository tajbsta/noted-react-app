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
import LaneBryant from '../src/lib/vendors/laneBryant';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/LANEBRYANT.json';

describe('LANEBRYANT', () => {
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
      const orderData = await LaneBryant.parse(VENDOR_CODES.LANEBRYANT, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'OLBW142814305',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Livi High-rise Soft Capri Legging',
            thumbnail: 'https://lanebryant.scene7.com/is/image/lanebryantProdATG/367201_0000101180?$medium$',
            price: 34.96
          },
          {
            name: 'Perfect Sleeve Max Swing Tunic Tee',
            thumbnail: 'https://lanebryant.scene7.com/is/image/lanebryantProdATG/367273_0000007780?$medium$',
            price: 27.96
          }
        ],
        vendor: VENDOR_CODES.LANEBRYANT,
        emailId: '178f10d10642adb6'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      const regexToSearchFor = new RegExp('Qty: 1');
      updatedBody = updatedBody.replace(regexToSearchFor, 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await LaneBryant.parse(VENDOR_CODES.LANEBRYANT, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'OLBW142814305',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Livi High-rise Soft Capri Legging (1)',
            thumbnail: 'https://lanebryant.scene7.com/is/image/lanebryantProdATG/367201_0000101180?$medium$',
            price: 34.96
          },
          {
            name: 'Livi High-rise Soft Capri Legging (2)',
            thumbnail: 'https://lanebryant.scene7.com/is/image/lanebryantProdATG/367201_0000101180?$medium$',
            price: 34.96
          },
          {
            name: 'Perfect Sleeve Max Swing Tunic Tee',
            thumbnail: 'https://lanebryant.scene7.com/is/image/lanebryantProdATG/367273_0000007780?$medium$',
            price: 27.96
          }
        ],
        vendor: VENDOR_CODES.LANEBRYANT,
        emailId: '178f10d10642adb6'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(LaneBryant.parse(VENDOR_CODES.LANEBRYANT, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
