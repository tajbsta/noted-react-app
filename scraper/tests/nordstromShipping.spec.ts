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
import Nordstrom from '../src/lib/vendors/nordstrom';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/NORDSTROM-SHIPPING.json';

describe('Nordstrom Shipping', () => {
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
      const orderData = await Nordstrom.parse(VENDOR_CODES.NORDSTROM, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '694038992',
        orderDate: 1621728000000,
        products: [
          {
            name: 'True & Co. True Body Triangle Lace Racerback Bralette',
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/df99c784-df98-4f20-bb3a-66c27465dc79.jpeg',
            price: 52
          },
          {
            name: "b.tempt'd by Wacoal Future Foundations Front Close Racerback Bra",
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/a483d23c-0bf5-4894-bace-bd3b0a61bb30.jpeg',
            price: 44
          },
          {
            name: 'Hue Ultra Wide Waistband Capri Leggings',
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/52975eeb-63aa-4daa-ac92-d6e724dbfca9.jpeg',
            price: 34
          }
        ],
        vendor: VENDOR_CODES.NORDSTROM,
        emailId: '1799b389634def8e'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Qty: 1`, `Qty: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Nordstrom.parse(VENDOR_CODES.NORDSTROM, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '694038992',
        orderDate: 1621728000000,
        products: [
          {
            name: 'True & Co. True Body Triangle Lace Racerback Bralette (1)',
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/df99c784-df98-4f20-bb3a-66c27465dc79.jpeg',
            price: 52
          },
          {
            name: 'True & Co. True Body Triangle Lace Racerback Bralette (2)',
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/df99c784-df98-4f20-bb3a-66c27465dc79.jpeg',
            price: 52
          },
          {
            name: "b.tempt'd by Wacoal Future Foundations Front Close Racerback Bra",
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/a483d23c-0bf5-4894-bace-bd3b0a61bb30.jpeg',
            price: 44
          },
          {
            name: 'Hue Ultra Wide Waistband Capri Leggings',
            thumbnail: 'https://n.nordstrommedia.com/id/sr3/52975eeb-63aa-4daa-ac92-d6e724dbfca9.jpeg',
            price: 34
          }
        ],
        vendor: VENDOR_CODES.NORDSTROM,
        emailId: '1799b389634def8e'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Nordstrom.parse(VENDOR_CODES.NORDSTROM, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
