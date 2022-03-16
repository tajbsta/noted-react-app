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
import Fabletics from '../src/lib/vendors/fabletics';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/FABLETICS.json';

describe(`Fabletics`, () => {
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
      const orderData = await Fabletics.parse(VENDOR_CODES.FABLETICS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1089587349',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Define High-Waisted 7/8 Legging',
            price: 64.95,
            thumbnail:
              'http://fabletics-us-cdn.justfab.com/media/images/products/CS1719629-0001/CS1719629-0001-1_130x195.jpg'
          },
          {
            name: 'Sync Seamless Midi Bra',
            price: 34.95,
            thumbnail:
              'http://fabletics-us-cdn.justfab.com/media/images/products/BA1937538-0001/BA1937538-0001-1_130x195.jpg'
          }
        ],
        vendor: VENDOR_CODES.FABLETICS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('<td>Qty:1</td>', '<td>Qty:2</td>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Fabletics.parse(VENDOR_CODES.FABLETICS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1089587349',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Define High-Waisted 7/8 Legging (1)',
            price: 64.95,
            thumbnail:
              'http://fabletics-us-cdn.justfab.com/media/images/products/CS1719629-0001/CS1719629-0001-1_130x195.jpg'
          },
          {
            name: 'Define High-Waisted 7/8 Legging (2)',
            price: 64.95,
            thumbnail:
              'http://fabletics-us-cdn.justfab.com/media/images/products/CS1719629-0001/CS1719629-0001-1_130x195.jpg'
          },
          {
            name: 'Sync Seamless Midi Bra',
            price: 34.95,
            thumbnail:
              'http://fabletics-us-cdn.justfab.com/media/images/products/BA1937538-0001/BA1937538-0001-1_130x195.jpg'
          }
        ],
        vendor: VENDOR_CODES.FABLETICS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Fabletics.parse(VENDOR_CODES.FABLETICS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
