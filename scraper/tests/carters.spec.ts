import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import Carters from '../src/lib/vendors/carters';

chai.use(chaiAsPromised);

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/CARTERS.json';

describe('Carter', () => {
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
      const orderData = await Carters.parse(VENDOR_CODES.CARTERS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'BCAR69660662',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Glitter Giraffe Jersey Tee',
            price: 6,
            thumbnail: 'http://www.carters.com/imageservice/thumbnail/2L978915.jpg'
          },
          {
            name: 'Polka Dot Pull-On Shorts',
            price: 7,
            thumbnail: 'http://www.carters.com/imageservice/thumbnail/2K483413.jpg'
          }
        ],
        vendor: VENDOR_CODES.CARTERS,
        emailId: '178d0f485e57deb0'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;
      updatedBody = updatedBody.replace(
        `<td class="F11" align="right" valign="top" width="17%" style=" font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:normal;color:#666666;">1</td>`,
        `<td class="F11" align="right" valign="top" width="17%" style=" font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:normal;color:#666666;">2</td>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Carters.parse(VENDOR_CODES.CARTERS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'BCAR69660662',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Glitter Giraffe Jersey Tee (1)',
            price: 6,
            thumbnail: 'http://www.carters.com/imageservice/thumbnail/2L978915.jpg'
          },
          {
            name: 'Glitter Giraffe Jersey Tee (2)',
            price: 6,
            thumbnail: 'http://www.carters.com/imageservice/thumbnail/2L978915.jpg'
          },
          {
            name: 'Polka Dot Pull-On Shorts',
            price: 7,
            thumbnail: 'http://www.carters.com/imageservice/thumbnail/2K483413.jpg'
          }
        ],
        vendor: VENDOR_CODES.CARTERS,
        emailId: '178d0f485e57deb0'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Carters.parse(VENDOR_CODES.CARTERS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
