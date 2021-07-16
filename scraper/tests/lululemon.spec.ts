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
import Lululemon from '../src/lib/vendors/lululemon';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/LULULEMON.json';

describe('Lululemon', () => {
  let sandbox: sinon.SinonSandbox;
  let payload: IEmailPayload = {
    raw: '',
    internalDate: '',
    decodedBody: ''
  };

  before(async () => {
    const res = await axios.get(TEST_DATA_URL);

    payload.decodedBody = Buffer.from(res.data.raw, 'base64').toString('utf-8');
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
      const orderData = await Lululemon.parse(VENDOR_CODES.LULULEMON, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'c23028191657',
        orderDate: 1622678400000,
        products: [
          {
            name: 'ABC Jogger Tall 32" *Warpstreme Online Only',
            thumbnail: 'https://images.lululemon.com/is/image/lululemon/LM5A31T_031382_1',
            price: 128
          },
          {
            name: 'Power Stride No-Show Sock with Active Grip',
            thumbnail: 'https://images.lululemon.com/is/image/lululemon/LW9CT9S_0002_1',
            price: 14
          }
        ],
        vendor: VENDOR_CODES.LULULEMON
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty: 1', 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Lululemon.parse(VENDOR_CODES.LULULEMON, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'c23028191657',
        orderDate: 1622678400000,
        products: [
          {
            name: 'ABC Jogger Tall 32" *Warpstreme Online Only (1)',
            thumbnail: 'https://images.lululemon.com/is/image/lululemon/LM5A31T_031382_1',
            price: 128
          },
          {
            name: 'ABC Jogger Tall 32" *Warpstreme Online Only (2)',
            thumbnail: 'https://images.lululemon.com/is/image/lululemon/LM5A31T_031382_1',
            price: 128
          },
          {
            name: 'Power Stride No-Show Sock with Active Grip',
            thumbnail: 'https://images.lululemon.com/is/image/lululemon/LW9CT9S_0002_1',
            price: 14
          }
        ],
        vendor: VENDOR_CODES.LULULEMON
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Lululemon.parse(VENDOR_CODES.LULULEMON, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
