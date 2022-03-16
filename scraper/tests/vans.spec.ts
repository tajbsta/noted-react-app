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
import Vans from '../src/lib/vendors/vans';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/VANS.json';

describe('Vans', () => {
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
      const orderData = await Vans.parse(VENDOR_CODES.VANS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '35322167',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Toddler Checkerboard Slip-On V',
            price: 35,
            thumbnail: 'https://images.vans.com/is/image/Vans/4885GX-HERO?$108x108$'
          },
          {
            name: 'Eco Theory Slip-On SF',
            price: 70,
            thumbnail: 'https://images.vans.com/is/image/Vans/MVD42E-HERO?$108x108$'
          }
        ],
        vendor: VENDOR_CODES.VANS,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Quantity: 1<br></td>`, `Quantity: 2<br></td>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Vans.parse(VENDOR_CODES.VANS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '35322167',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Toddler Checkerboard Slip-On V (1)',
            price: 35,
            thumbnail: 'https://images.vans.com/is/image/Vans/4885GX-HERO?$108x108$'
          },
          {
            name: 'Toddler Checkerboard Slip-On V (2)',
            price: 35,
            thumbnail: 'https://images.vans.com/is/image/Vans/4885GX-HERO?$108x108$'
          },
          {
            name: 'Eco Theory Slip-On SF',
            price: 70,
            thumbnail: 'https://images.vans.com/is/image/Vans/MVD42E-HERO?$108x108$'
          }
        ],
        vendor: VENDOR_CODES.VANS,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Vans.parse(VENDOR_CODES.VANS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
