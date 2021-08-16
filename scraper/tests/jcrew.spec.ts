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
import JCREW from '../src/lib/vendors/jcrew';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/JCREW.json';

describe('JCREW', () => {
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
      const orderData = await JCREW.parse(VENDOR_CODES.JCREW, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1185936048',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Slim-fit Baird McNutt Irish linen shirt',
            thumbnail: 'https://www.jcrew.com/s7-img-facade/AW694_NA6436?$bag_tn150$',
            price: 89.5
          },
          {
            name: 'Classic-fit short-sleeve lightweight cotton poplin shirt',
            thumbnail: 'https://www.jcrew.com/s7-img-facade/AW866_WT0002?$bag_tn150$',
            price: 69.5
          }
        ],
        vendor: VENDOR_CODES.JCREW,
        emailId: '178f04a2026b22b1'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Qty: 1', 'Qty: 3');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await JCREW.parse(VENDOR_CODES.JCREW, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '1185936048',
        orderDate: 1618876800000,
        products: [
          {
            name: 'Slim-fit Baird McNutt Irish linen shirt (1)',
            thumbnail: 'https://www.jcrew.com/s7-img-facade/AW694_NA6436?$bag_tn150$',
            price: 89.5
          },
          {
            name: 'Slim-fit Baird McNutt Irish linen shirt (2)',
            thumbnail: 'https://www.jcrew.com/s7-img-facade/AW694_NA6436?$bag_tn150$',
            price: 89.5
          },
          {
            name: 'Slim-fit Baird McNutt Irish linen shirt (3)',
            thumbnail: 'https://www.jcrew.com/s7-img-facade/AW694_NA6436?$bag_tn150$',
            price: 89.5
          },
          {
            name: 'Classic-fit short-sleeve lightweight cotton poplin shirt',
            thumbnail: 'https://www.jcrew.com/s7-img-facade/AW866_WT0002?$bag_tn150$',
            price: 69.5
          }
        ],
        vendor: VENDOR_CODES.JCREW,
        emailId: '178f04a2026b22b1'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(JCREW.parse(VENDOR_CODES.JCREW, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
