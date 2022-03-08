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
import ToryBurch from '../src/lib/vendors/toryBurch';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/TORYBURCH.json';

describe('Tory Burch', () => {
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
      const orderData = await ToryBurch.parse(VENDOR_CODES.TORYBURCH, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '792816518',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Embrace Ambition Bracelet',
            price: 30.0,
            thumbnail: 'http://s7.toryburch.com/is/image/ToryBurchLLC/TB_53484_708?$trb_grid_224x254$'
          },
          {
            name: 'Good Luck Trainer',
            price: 278.0,
            thumbnail: 'http://s7.toryburch.com/is/image/ToryBurchLLC/TB_83833_100?$trb_grid_224x254$'
          }
        ],
        vendor: VENDOR_CODES.TORYBURCH,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(/Qty:.*/, 'Qty: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await ToryBurch.parse(VENDOR_CODES.TORYBURCH, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '792816518',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Embrace Ambition Bracelet (1)',
            price: 30.0,
            thumbnail: 'http://s7.toryburch.com/is/image/ToryBurchLLC/TB_53484_708?$trb_grid_224x254$'
          },
          {
            name: 'Embrace Ambition Bracelet (2)',
            price: 30.0,
            thumbnail: 'http://s7.toryburch.com/is/image/ToryBurchLLC/TB_53484_708?$trb_grid_224x254$'
          },
          {
            name: 'Good Luck Trainer',
            price: 278.0,
            thumbnail: 'http://s7.toryburch.com/is/image/ToryBurchLLC/TB_83833_100?$trb_grid_224x254$'
          }
        ],
        vendor: VENDOR_CODES.TORYBURCH,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(ToryBurch.parse(VENDOR_CODES.TORYBURCH, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
