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
import Belk from '../src/lib/vendors/belk';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/BELK.json';

describe('Belk', () => {
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
      const orderData = await Belk.parse(VENDOR_CODES.BELK, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '34638897',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Free People Makai Cut Off Shorts',
            thumbnail: 'https://belk.scene7.com/is/image/Belk?layer=0&src=1802734_OB1268908_A_020&',
            price: 68
          }
        ],
        vendor: VENDOR_CODES.BELK,
        emailId: '178d0d4341fd6576'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty: 1<br />', 'Qty: 2<br />');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Belk.parse(VENDOR_CODES.BELK, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '34638897',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Free People Makai Cut Off Shorts (1)',
            thumbnail: 'https://belk.scene7.com/is/image/Belk?layer=0&src=1802734_OB1268908_A_020&',
            price: 68
          },
          {
            name: 'Free People Makai Cut Off Shorts (2)',
            thumbnail: 'https://belk.scene7.com/is/image/Belk?layer=0&src=1802734_OB1268908_A_020&',
            price: 68
          }
        ],
        vendor: VENDOR_CODES.BELK,
        emailId: '178d0d4341fd6576'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Belk.parse(VENDOR_CODES.BELK, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
