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
import HM from '../src/lib/vendors/hm';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/HM.json';

describe('H&M', () => {
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
      const orderData = await HM.parse(VENDOR_CODES.HM, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '19303584023',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Ribbed Flared Pants',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: 'Rib-knit Shorts',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: 'Rib-knit Tank Top',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: '2-piece Cotton Set',
            price: 14.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.HM,
        emailId: '178f027c87e006c6'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        '<td align="left" valign="middle" style="margin-top: 0;margin-bottom: 0;color: #000000;line-height: 1.36;border-bottom: 1px solid #c8c8c8;">1</td>',
        '<td align="left" valign="middle" style="margin-top: 0;margin-bottom: 0;color: #000000;line-height: 1.36;border-bottom: 1px solid #c8c8c8;">3</td>'
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await HM.parse(VENDOR_CODES.HM, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '19303584023',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Ribbed Flared Pants (1)',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: 'Ribbed Flared Pants (2)',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: 'Ribbed Flared Pants (3)',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: 'Rib-knit Shorts',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: 'Rib-knit Tank Top',
            price: 17.99,
            thumbnail: ''
          },
          {
            name: '2-piece Cotton Set',
            price: 14.99,
            thumbnail: ''
          }
        ],
        vendor: VENDOR_CODES.HM,
        emailId: '178f027c87e006c6'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(HM.parse(VENDOR_CODES.HM, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
